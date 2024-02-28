/* eslint-disable @typescript-eslint/no-floating-promises */

import { type NESControlBus } from '../../../src/nes/components/core/control-bus/types'
import { type NESCpuComponent, type NESInstructionComponent } from '../../../src/nes/components/core/cpu/types'
import { type NESMemoryComponent } from '../../../src/nes/components/core/memory/types'
import { DebugEvents } from '../../../src/nes/components/debugger/consts/events'
import { type NESDebuggerComponent } from '../../../src/nes/components/debugger/types'
import { type NESDisASMComponent } from '../../../src/nes/components/disasm/types'
import { ROM } from '../../../src/nes/components/rom/rom'
import { type NESRomComponent, type ROMLoader } from '../../../src/nes/components/rom/types'
import { NES } from '../../../src/nes/nes'
import { type NESModule } from '../../../src/nes/types'
import { FileLoader, storePRG } from '../helpers'

describe('Tests for NES ROMs executions.', () => {
  let nes: NESModule
  let control: NESControlBus
  let cpu: NESCpuComponent
  let memory: NESMemoryComponent
  let instruction: NESInstructionComponent
  let nesDebugger: NESDebuggerComponent
  let disASM: NESDisASMComponent
  let rom: NESRomComponent
  let romLoader: ROMLoader

  beforeEach(() => {
    nes = NES.create()
    control = nes.getComponents().control
    nesDebugger = nes.debug()
    disASM = nesDebugger.getComponents().disASM

    cpu = control.getComponents().cpu
    memory = control.getComponents().memory
    instruction = control.getComponents().instruction
  })

  test('should execute the PRG code after power-up', (done) => {
    /**
      0x8000  78      sei
      0x8001  d8      cld
      0x8002  a20f    ldx #$0f
      0x8004  9a      txs
      0x8005  ad0220  lda $2002   (sym.PPU_STATUS)
      0x8008  30fb    bmi $8005
      0x800a  a900    lda #$00
      0x800c  ea      nop
     */
    const prg = new Uint8Array([
      0x78, 0xd8, 0xa2, 0x0f, 0x9a, 0xad, 0x02, 0x20, 0x30, 0xfb, 0xa9, 0x00,
      0xea
    ])
    storePRG(memory, prg)

    nesDebugger.addBreakpoint(0x800a)
    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ type, data }) => {
      const { pc } = data
      const { isRunning } = data.cpuState

      const currentInsBytes = instruction.fetchInstructionBytes(pc)
      const [opcode] = currentInsBytes
      const asm = disASM.getInstructionASM({
        opcode,
        operand: currentInsBytes[1],
        supported: true
      })

      expect(type).toBe(DebugEvents.Pause)
      expect(isRunning).toBe(false)
      expect(pc).toBe(0x800a)
      expect(asm).toBe('lda #$00')
      expect(opcode).toBe(0xa9)

      done()
    })
  })

  test('should execute the PRG code with branching after power-up', (done) => {
    /**
      0x8000  78      sei
      0x8001  d8      cld
      0x8002  a2ff    ldx #$ff    (Cause branching, NegativeFlag set)
      0x8004  9a      txs
      0x8005  ad0220  lda $2002   (sym.PPU_STATUS)
      0x8008  10fb    bpl $8005   (Branch because negative flag is always zero from $2002)
      0x800a  a900    lda #$00
      0x700c  ea      nop
     */
    const prg = new Uint8Array([
      0x78, 0xd8, 0xa2, 0xff, 0x9a, 0xad, 0x02, 0x20, 0x10, 0xfb, 0xa9, 0x00,
      0xea
    ])
    storePRG(memory, prg)

    nesDebugger.breakOn({ insExecuted: 20 })
    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ type, data }) => {
      const { pc } = data
      const { isRunning } = data.cpuState

      const currentInsBytes = instruction.fetchInstructionBytes(pc)
      const [opcode] = currentInsBytes
      const asm = disASM.getInstructionASM({
        opcode,
        operand: currentInsBytes[1],
        supported: true
      })

      expect(type).toBe(DebugEvents.Pause)
      expect(asm).toBe('lda $2002')
      expect(opcode).toBe(0xad)
      expect(pc).toBe(0x8005)
      expect(isRunning).toBe(false)

      done()
    })
  })

  test('should stop execution before the first instruction is executed', (done) => {
    const filePath =
      './tests/integration/__nes_roms__/instr_test-v5/rom_singles/01-basics.nes'
    const romResetVector = 0xe683

    romLoader = new FileLoader(filePath)
    romLoader.getBytes().then(bytes => {
      rom = ROM.create(bytes)

      nesDebugger.breakOn({ atResetVector: true })
      nes.loadROM(rom)

      nesDebugger.on(DebugEvents.Pause, ({ type, data }) => {
        const { pc } = data
        const { isRunning } = data.cpuState

        const currentInsBytes = instruction.fetchInstructionBytes(pc)
        const asm = disASM.getInstructionASM({
          opcode: currentInsBytes[0],
          operand: currentInsBytes[1],
          supported: true
        })

        expect(type).toBe(DebugEvents.Pause)
        expect(pc).toBe(romResetVector)
        expect(asm).toBe('sei')
        expect(isRunning).toBe(false)

        done()
      })
    })
  })

  test('should stop execution when ROM test status was running (0x80)', (done) => {
    const filePath =
      './tests/integration/__nes_roms__/instr_test-v5/rom_singles/01-basics.nes'
    const testStatusAddress = 0x6000

    romLoader = new FileLoader(filePath)

    romLoader.getBytes().then(bytes => {
      rom = ROM.create(bytes)

      nesDebugger.addMemoryBreakpoint({
        address: testStatusAddress,
        equalsTo: 0x80,
        onWrite: true
      })
      nes.loadROM(rom)

      nesDebugger.on(DebugEvents.Pause, ({ type, data }) => {
        const { pc } = data
        const { isRunning } = data.cpuState
        const memoryValue = memory.load(testStatusAddress)

        expect(type).toBe(DebugEvents.Pause)
        expect(isRunning).toBe(false)
        expect(memoryValue).toBe(0x80)
        expect(pc).toBeLessThanOrEqual(0xffff)
        expect(cpu.getPC()).toBeGreaterThanOrEqual(0x8000)

        done()
      })
    })
  })

  test('should stop execution when ROM test $6001 memory value is between (0x80-0xff) status', (done) => {
    const filePath =
      './tests/integration/__nes_roms__/instr_test-v5/rom_singles/01-basics.nes'
    const testStatusAddress = 0x6001

    romLoader = new FileLoader(filePath)

    romLoader.getBytes().then(bytes => {
      rom = ROM.create(bytes)

      nesDebugger.addMemoryBreakpoint({
        address: testStatusAddress,
        greaterThanOrEquals: 0x80,
        lessThanOrEquals: 0xff,
        onWrite: true
      })
      nes.loadROM(rom)

      nesDebugger.on(DebugEvents.Pause, ({ type, data }) => {
        const { pc } = data
        const { isRunning } = data.cpuState
        const memoryValue = memory.load(testStatusAddress)

        expect(type).toBe(DebugEvents.Pause)
        expect(isRunning).toBe(false)
        expect(memoryValue).toBe(0xde)
        expect(pc).toBeGreaterThanOrEqual(0x8000)
        expect(cpu.getPC()).toBeLessThanOrEqual(0xffff)

        done()
      })
    })
  })
})
