/* eslint-disable @typescript-eslint/no-floating-promises */
import { type NESDebuggerComponent } from '../../../src/nes/components/debugger/types'
import { NES } from '../../../src/nes/nes'
import { type NESModule } from '../../../src/nes/types'

describe('Tests for timings on NES Components.', () => {
  let nes: NESModule
  let nesDebugger: NESDebuggerComponent

  beforeEach(() => {
    nes = NES.create()
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
})
