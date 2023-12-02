
import { CPU_MEMORY_MAP } from '../../src/cpu/consts/memory-map'
import { CPU } from '../../src/cpu/cpu'

describe('Tests for ROMs executions.', () => {
  let cpu

  function storePRG (prg) {
    cpu.storeWord(CPU_MEMORY_MAP.Reset_Vector, 0x8000)
    for (let address = 0x8000, index = 0; index < prg.length; address++, index++) {
      cpu.store(address, prg[index])
    }
  }

  beforeEach(() => {
    cpu = CPU()
  })

  test('should execute the PRG code after power-up', done => {
    /**
      0x8000  78      sei
      0x8001  d8      cld
      0x8002  a20f    ldx #$0f
      0x8004  9a      txs
      0x8005  ad0220  lda $2002   (sym.PPU_STATUS)
      0x8008  30fb    bmi $8005
      0x800a  a900    lda #$00
      0x700c  ea      nop
     */
    const prg = new Uint8Array([
      0x78, 0xd8, 0xa2, 0x0f,
      0x9a, 0xad, 0x02, 0x20,
      0x30, 0xfb, 0xa9, 0x00,
      0xea
    ])
    storePRG(prg)

    cpu.pauseWhen({ breakpoints: [0x800c] })
    cpu.powerUp()

    setTimeout(() => {
      const { opcode, asm } = cpu.getLastExecuted()

      expect(asm).toBe('lda #$00')
      expect(cpu.getPC()).toBe(0x800c)
      expect(opcode).toBe(0xa9)
      expect(cpu.getCPUController().paused).toBe(true)

      done()
    }, 100)
  })

  test('should execute the PRG code with branching after power-up', done => {
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
      0x78, 0xd8, 0xa2, 0xff,
      0x9a, 0xad, 0x02, 0x20,
      0x10, 0xfb, 0xa9, 0x00,
      0xea
    ])
    storePRG(prg)

    cpu.pauseWhen({ instructionsExecuted: 21 })
    cpu.powerUp()

    setTimeout(() => {
      const { opcode, asm } = cpu.getLastExecuted()

      expect(asm).toBe('lda $2002')
      expect(cpu.getPC()).toBe(0x8008)
      expect(opcode).toBe(0xad)
      expect(cpu.getCPUController().paused).toBe(true)

      done()
    }, 100)
  })

  test('should stop execution before the first instruction is executed', done => {
    const filePath = './test/__roms__/instr_test-v5/rom_singles/01-basics.nes'
    const romResetVector = 0xe683
    cpu.pauseWhen({
      atResetVector: true
    })

    cpu.loadROM({ filePath })
      .then(() => {
        setTimeout(() => {
          const pc = cpu.getPC()
          expect(pc).toBe(romResetVector)
          expect(cpu.getCPUController().paused).toBe(true)

          done()
        }, 0)
      })
  })

  test('should stop execution when ROM test status was running (0x80)', done => {
    const filePath = './test/__roms__/instr_test-v5/rom_singles/01-basics.nes'
    const testStatusAddress = 0x6000
    cpu.pauseWhen({
      memory: [{
        address: testStatusAddress,
        equalsTo: 0x80,
        onWrite: true
      }]
    })

    cpu.loadROM({ filePath })
      .then(() => {
        setTimeout(() => {
          const pc = cpu.getPC()
          const memoryValue = cpu.load(testStatusAddress)

          expect(cpu.getCPUController().paused).toBe(true)
          expect(memoryValue).toBe(0x80)
          expect(pc).toBeLessThanOrEqual(0xffff)
          expect(pc).toBeGreaterThanOrEqual(0x8000)

          done()
        }, 400)
      })
  })

  test('should stop execution when ROM test $6001 memory value is between (0x80-0xff) status', done => {
    const filePath = './test/__roms__/instr_test-v5/rom_singles/01-basics.nes'
    const testStatusAddress = 0x6001
    cpu.pauseWhen({
      memory: [
        {
          address: testStatusAddress,
          greaterThanOrEquals: 0x80,
          lessThanOrEquals: 0xff,
          onWrite: true
        }]
    })

    cpu.loadROM({ filePath })
      .then(() => {
        setTimeout(() => {
          const pc = cpu.getPC()
          const memoryValue = cpu.load(testStatusAddress)

          expect(cpu.getCPUController().paused).toBe(true)
          expect(memoryValue).toBe(0xde)
          expect(pc).toBeGreaterThanOrEqual(0x8000)
          expect(pc).toBeLessThanOrEqual(0xffff)

          done()
        }, 400)
      })
  })
})
