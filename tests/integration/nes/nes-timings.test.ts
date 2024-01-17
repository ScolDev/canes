/* eslint-disable @typescript-eslint/no-floating-promises */
import { type NESMemoryComponent } from '../../../src/core/memory/types'
import { type NESDebuggerComponent } from '../../../src/nes/components/debugger/types'
import { NES } from '../../../src/nes/nes'
import { type NESModule } from '../../../src/nes/types'
import { storePRG } from '../helpers/memory-helper'

describe('Tests for timings on NES Components.', () => {
  let nes: NESModule
  let memory: NESMemoryComponent
  let nesDebugger: NESDebuggerComponent

  beforeEach(() => {
    nes = NES.create()

    memory = nes.getComponents().memory
    nesDebugger = nes.debug()
  })

  test('should execute a ROM file with the exact cpu cycles per instruction', (done) => {
    // This PRG tested code before breaking on 0xe847,
    // only contains extra cycles for branch instructions

    const filePath = './tests/integration/__nes_roms__/instr_test-v5/rom_singles/01-basics.nes'
    const expectedPC = 0xe847
    const expectedCycles = 46086
    const expectedInsExecuted = 15000
    nesDebugger.breakOn({ insExecuted: expectedInsExecuted })

    nes.loadROM({ filePath })

    nesDebugger.on('pause', ({ data }) => {
      expect(data.pc).toBe(expectedPC)
      expect(data.cpuState.insExecuted).toBe(expectedInsExecuted)
      expect(data.cpuState.clock.cycles).toBe(expectedCycles)

      done()
    })
  })

  test('should count 4 cpu cycles for BCC instruction when crossing page on branching.', (done) => {
    /**
      0x80fa  18      clc
      0x80fb  9010    bcc $810d ; Branch to another page
     */
    const prg = new Uint8Array([0x18, 0x90, 0x10])
    // Near boundary page
    const resetVector = 0x80fa
    // 2 for clc and 4 for bcc
    const expectedCycles = 6
    const expectedPC = 0x810d

    storePRG(memory, prg, resetVector)
    nesDebugger.breakOn({ insExecuted: 2 })

    nesDebugger.run()

    nesDebugger.on('pause', ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count 4 cpu cycles for BCS instruction when crossing page on branching.', (done) => {
    /**
      0x80fa  38      sec
      0x80fb  b010    bcs $810d ; Branch to another page
     */
    const prg = new Uint8Array([0x38, 0xb0, 0x10])
    // Near boundary page
    const resetVector = 0x80fa
    // 2 for sec and 4 for bcc
    const expectedCycles = 6
    const expectedPC = 0x810d

    storePRG(memory, prg, resetVector)
    nesDebugger.breakOn({ insExecuted: 2 })

    nesDebugger.run()

    nesDebugger.on('pause', ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count 4 cpu cycles for BEQ instruction when crossing page on branching.', (done) => {
    /**
      0x80fa  a900    lda #$00
      0x80fc  f010    beq $810e ; Branch to another page
     */
    const prg = new Uint8Array([0xa9, 0x00, 0xf0, 0x10])
    // Near boundary page
    const resetVector = 0x80fa
    // 2 for lda and 4 for beq
    const expectedCycles = 6
    const expectedPC = 0x810e

    storePRG(memory, prg, resetVector)
    nesDebugger.breakOn({ insExecuted: 2 })

    nesDebugger.run()

    nesDebugger.on('pause', ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count 4 cpu cycles for BNE instruction when crossing page on branching.', (done) => {
    /**
      0x80fa  a901    lda #$01
      0x80fc  d010    bne $810e ; Branch to another page
     */
    const prg = new Uint8Array([0xa9, 0x01, 0xd0, 0x10])
    // Near boundary page
    const resetVector = 0x80fa
    // 2 for lda and 4 for bne
    const expectedCycles = 6
    const expectedPC = 0x810e

    storePRG(memory, prg, resetVector)
    nesDebugger.breakOn({ insExecuted: 2 })

    nesDebugger.run()

    nesDebugger.on('pause', ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count 4 cpu cycles for BMI instruction when crossing page on branching.', (done) => {
    /**
      0x80fa  a9a2    lda #$a2
      0x80fc  3010    bmi $810e ; Branch to another page
     */
    const prg = new Uint8Array([0xa9, 0xa2, 0x30, 0x10])
    // Near boundary page
    const resetVector = 0x80fa
    // 2 for lda and 4 for bmi
    const expectedCycles = 6
    const expectedPC = 0x810e

    storePRG(memory, prg, resetVector)
    nesDebugger.breakOn({ insExecuted: 2 })

    nesDebugger.run()

    nesDebugger.on('pause', ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count 4 cpu cycles for BPL instruction when crossing page on branching.', (done) => {
    /**
      0x80fa  a902    lda #$02
      0x80fc  1010    bpl $810e ; Branch to another page
     */
    const prg = new Uint8Array([0xa9, 0x02, 0x10, 0x10])
    // Near boundary page
    const resetVector = 0x80fa
    // 2 for lda and 4 for bpl
    const expectedCycles = 6
    const expectedPC = 0x810e

    storePRG(memory, prg, resetVector)
    nesDebugger.breakOn({ insExecuted: 2 })

    nesDebugger.run()

    nesDebugger.on('pause', ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count 4 cpu cycles for BVC instruction when crossing page on branching.', (done) => {
    /**
      0x80fa  b8      clv
      0x80fb  5010    bvc $810d ; Branch to another page
     */
    const prg = new Uint8Array([0xb8, 0x50, 0x10])
    // Near boundary page
    const resetVector = 0x80fa
    // 2 for sec and 4 for bvc
    const expectedCycles = 6
    const expectedPC = 0x810d

    storePRG(memory, prg, resetVector)
    nesDebugger.breakOn({ insExecuted: 2 })

    nesDebugger.run()

    nesDebugger.on('pause', ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count 4 cpu cycles for BVS instruction when crossing page on branching.', (done) => {
    /**
      0x80fa  e970    sbc #$8a
      0x80fc  7010    bvs $810e ; Branch to another page
     */
    const prg = new Uint8Array([0xe9, 0x70, 0x70, 0x10])
    // Near boundary page
    const resetVector = 0x80fa
    // 2 for lda and 4 for bvs
    const expectedCycles = 6
    const expectedPC = 0x810e

    storePRG(memory, prg, resetVector)
    nesDebugger.breakOn({ insExecuted: 2 })

    nesDebugger.run()

    nesDebugger.on('pause', ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })
})
