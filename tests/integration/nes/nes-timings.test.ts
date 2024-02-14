/* eslint-disable @typescript-eslint/no-floating-promises */
import { type NESMemoryComponent } from '../../../src/core/memory/types'
import { DebugEvents } from '../../../src/nes/components/debugger/consts/events'
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

    const filePath =
      './tests/integration/__nes_roms__/instr_test-v5/rom_singles/01-basics.nes'
    const expectedPC = 0xe847
    const expectedCycles = 46086
    const expectedInsExecuted = 15000
    nesDebugger.breakOn({ insExecuted: expectedInsExecuted })

    nes.loadROM({ filePath })

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
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

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
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

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
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

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
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

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
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

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
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

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
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

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
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

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count the extra cpu cycles for ADC instruction when crossing page.', (done) => {
    /**
      0x8000  a2ff      ldx #$ff      ; Preconditions to ensure cross page access
      0x8002  a0ff      ldy #$ff
      0x8004  a972      lda #$72      ; Store in $0020 the $0472 address
      0x8006  8520      sta #$20
      0x8008  a904      lda #$04
      0x800a  8521      sta #$21
      0x800c  7d7204    adc $0472, X  ; Execute the extra cycle for ADC instructions
      0x800f  797204    adc $0472, Y
      0x8012  7120      adc ($20), Y
     */
    const prg = new Uint8Array([
      0xa2, 0xff, 0xa0, 0xff, 0xa9, 0x72, 0x85, 0x20, 0xa9, 0x04, 0x85, 0x21,
      0x7d, 0x72, 0x04, 0x79, 0x72, 0x04, 0x71, 0x20
    ])
    // 27 + 3 (extra cycles for the ADC instructions)
    const expectedCycles = 30
    const expectedPC = 0x8014

    storePRG(memory, prg)
    nesDebugger.breakOn({ insExecuted: 9 })

    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count the extra cpu cycles for AND instruction when crossing page.', (done) => {
    /**
      0x8000  a2ff      ldx #$ff      ; Preconditions to ensure cross page access
      0x8002  a0ff      ldy #$ff
      0x8004  a972      lda #$72      ; Store in $0020 the $0472 address
      0x8006  8520      sta #$20
      0x8008  a904      lda #$04
      0x800a  8521      sta #$21
      0x800c  3d7204    and $0472, X  ; Execute the extra cycle for AND instructions
      0x800f  397204    and $0472, Y
      0x8012  3120      and ($20), Y
     */
    const prg = new Uint8Array([
      0xa2, 0xff, 0xa0, 0xff, 0xa9, 0x72, 0x85, 0x20, 0xa9, 0x04, 0x85, 0x21,
      0x3d, 0x72, 0x04, 0x39, 0x72, 0x04, 0x31, 0x20
    ])
    // 27 + 3 (extra cycles for the AND instructions)
    const expectedCycles = 30
    const expectedPC = 0x8014

    storePRG(memory, prg)
    nesDebugger.breakOn({ insExecuted: 9 })

    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count the extra cpu cycles for CMP instruction when crossing page.', (done) => {
    /**
      0x8000  a2ff      ldx #$ff      ; Preconditions to ensure cross page access
      0x8002  a0ff      ldy #$ff
      0x8004  a972      lda #$72      ; Store in $0020 the $0472 address
      0x8006  8520      sta #$20
      0x8008  a904      lda #$04
      0x800a  8521      sta #$21
      0x800c  dd7204    cmp $0472, X  ; Execute the extra cycle for CMP instructions
      0x800f  d97204    cmp $0472, Y
      0x8012  d120      cmp ($20), Y
     */
    const prg = new Uint8Array([
      0xa2, 0xff, 0xa0, 0xff, 0xa9, 0x72, 0x85, 0x20, 0xa9, 0x04, 0x85, 0x21,
      0xdd, 0x72, 0x04, 0xd9, 0x72, 0x04, 0xd1, 0x20
    ])
    // 27 + 3 (extra cycles for the CMP instructions)
    const expectedCycles = 30
    const expectedPC = 0x8014

    storePRG(memory, prg)
    nesDebugger.breakOn({ insExecuted: 9 })

    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count the extra cpu cycles for EOR instruction when crossing page.', (done) => {
    /**
      0x8000  a2ff      ldx #$ff      ; Preconditions to ensure cross page access
      0x8002  a0ff      ldy #$ff
      0x8004  a972      lda #$72      ; Store in $0020 the $0472 address
      0x8006  8520      sta #$20
      0x8008  a904      lda #$04
      0x800a  8521      sta #$21
      0x800c  5d7204    eor $0472, X  ; Execute the extra cycle for EOR instructions
      0x800f  597204    eor $0472, Y
      0x8012  5120      eor ($20), Y
     */
    const prg = new Uint8Array([
      0xa2, 0xff, 0xa0, 0xff, 0xa9, 0x72, 0x85, 0x20, 0xa9, 0x04, 0x85, 0x21,
      0x5d, 0x72, 0x04, 0x59, 0x72, 0x04, 0x51, 0x20
    ])
    // 27 + 3 (extra cycles for the EOR instructions)
    const expectedCycles = 30
    const expectedPC = 0x8014

    storePRG(memory, prg)
    nesDebugger.breakOn({ insExecuted: 9 })

    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count the extra cpu cycles for LDX instruction when crossing page.', (done) => {
    /**
      0x8000  a2ff      ldx #$ff      ; Preconditions to ensure cross page access
      0x8002  a0ff      ldy #$ff
      0x8004  a972      lda #$72      ; Store in $0020 the $0472 address
      0x8006  8520      sta #$20
      0x8008  a904      lda #$04
      0x800a  8521      sta #$21
      0x800c  be7204    ldx $0472, Y  ; Execute the extra cycle for LDX instruction
     */
    const prg = new Uint8Array([
      0xa2, 0xff, 0xa0, 0xff, 0xa9, 0x72, 0x85, 0x20, 0xa9, 0x04, 0x85, 0x21,
      0xbe, 0x72, 0x04
    ])
    // 18 + 1 (extra cycles for the LDX instructions)
    const expectedCycles = 19
    const expectedPC = 0x800f

    storePRG(memory, prg)
    nesDebugger.breakOn({ insExecuted: 7 })

    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count the extra cpu cycles for LDY instruction when crossing page.', (done) => {
    /**
      0x8000  a2ff      ldx #$ff      ; Preconditions to ensure cross page access
      0x8002  a0ff      ldy #$ff
      0x8004  a972      lda #$72      ; Store in $0020 the $0472 address
      0x8006  8520      sta #$20
      0x8008  a904      lda #$04
      0x800a  8521      sta #$21
      0x800c  bc7204    ldy $0472, Y  ; Execute the extra cycle for LDY instruction
     */
    const prg = new Uint8Array([
      0xa2, 0xff, 0xa0, 0xff, 0xa9, 0x72, 0x85, 0x20, 0xa9, 0x04, 0x85, 0x21,
      0xbc, 0x72, 0x04
    ])
    // 18 + 1 (extra cycles for the LDY instructions)
    const expectedCycles = 19
    const expectedPC = 0x800f

    storePRG(memory, prg)
    nesDebugger.breakOn({ insExecuted: 7 })

    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count the extra cpu cycles for ORA instruction when crossing page.', (done) => {
    /**
      0x8000  a2ff      ldx #$ff      ; Preconditions to ensure cross page access
      0x8002  a0ff      ldy #$ff
      0x8004  a972      lda #$72      ; Store in $0020 the $0472 address
      0x8006  8520      sta #$20
      0x8008  a904      lda #$04
      0x800a  8521      sta #$21
      0x800c  1d7204    ora $0472, X  ; Execute the extra cycle for ORA instructions
      0x800f  197204    ora $0472, Y
      0x8012  1120      ora ($20), Y
     */
    const prg = new Uint8Array([
      0xa2, 0xff, 0xa0, 0xff, 0xa9, 0x72, 0x85, 0x20, 0xa9, 0x04, 0x85, 0x21,
      0x1d, 0x72, 0x04, 0x19, 0x72, 0x04, 0x11, 0x20
    ])
    // 27 + 3 (extra cycles for the ORA instructions)
    const expectedCycles = 30
    const expectedPC = 0x8014

    storePRG(memory, prg)
    nesDebugger.breakOn({ insExecuted: 9 })

    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })

  test('should count the extra cpu cycles for SBC instruction when crossing page.', (done) => {
    /**
      0x8000  a2ff      ldx #$ff      ; Preconditions to ensure cross page access
      0x8002  a0ff      ldy #$ff
      0x8004  a972      lda #$72      ; Store in $0020 the $0472 address
      0x8006  8520      sta #$20
      0x8008  a904      lda #$04
      0x800a  8521      sta #$21
      0x800c  fd7204    sbc $0472, X  ; Execute the extra cycle for SBC instructions
      0x800f  f97204    sbc $0472, Y
      0x8012  f120      sbc ($20), Y
     */
    const prg = new Uint8Array([
      0xa2, 0xff, 0xa0, 0xff, 0xa9, 0x72, 0x85, 0x20, 0xa9, 0x04, 0x85, 0x21,
      0xfd, 0x72, 0x04, 0xf9, 0x72, 0x04, 0xf1, 0x20
    ])
    // 27 + 3 (extra cycles for the SBC instructions)
    const expectedCycles = 30
    const expectedPC = 0x8014

    storePRG(memory, prg)
    nesDebugger.breakOn({ insExecuted: 9 })

    nesDebugger.run()

    nesDebugger.on(DebugEvents.Pause, ({ data }) => {
      const { pc, cpuState } = data

      expect(cpuState.clock.cycles).toBe(expectedCycles)
      expect(pc).toBe(expectedPC)

      done()
    })
  })
})
