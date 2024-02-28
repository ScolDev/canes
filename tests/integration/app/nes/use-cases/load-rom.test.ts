import LoadDebugger from '../../../../../src/app/debugger/uses-cases/load-debugger'
import LoadROM from '../../../../../src/app/nes/use-cases/load-rom'
import { NES } from '../../../../../src/nes/nes'
import { type NESModule } from '../../../../../src/nes/types'
import { createROMLoader } from '../../../helpers'

describe('NES use cases', () => {
  let nes: NESModule
  beforeEach(() => {
    nes = NES.create()
  })

  test('should execute the LoadROM use case', async () => {
    const expectedBytes = Uint8Array.from([0x78, 0x4c, 0x12, 0xeb, 0x78, 0xd8])
    const loadROM = LoadROM.create(nes, createROMLoader())
    const resetVector = 0xe683

    await loadROM.execute()

    const { rom, control } = nes.getComponents()
    const { memory } = control.getComponents()

    expect(rom?.getHeader()).not.toBe(null)
    expect(nes.isPowerOn()).toBe(true)
    expect(memory.getMemorySection(resetVector, resetVector + 5)).toEqual(expectedBytes)
  })

  test('should execute the LoadROM use case when debugger is active', async () => {
    const loadDebugger = LoadDebugger.create(nes)
    const loadROM = LoadROM.create(nes, createROMLoader())

    await loadDebugger.execute()
    await loadROM.execute()

    const { nesDebugger } = nes.getComponents()
    const atResetVector = nesDebugger?.getState().conditions.atResetVector

    expect(nes.isPowerOn()).toBe(true)
    expect(atResetVector).toBe(true)
  })
})
