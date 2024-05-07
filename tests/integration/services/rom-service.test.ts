import LoadDebugger from 'src/app/debugger/uses-cases/load-debugger'
import { NES } from 'src/nes/nes'
import ROMService from 'src/nes/services/rom-service'
import { type NESModule } from 'src/nes/types'
import { createROMLoader } from 'tests/integration/helpers'

describe('ROM services', () => {
  let nes: NESModule
  beforeEach(() => {
    nes = NES.create()
  })

  test('should execute loadROM', async () => {
    const expectedBytes = Uint8Array.from([0x78, 0x4c, 0x12, 0xeb, 0x78, 0xd8])
    const romService = ROMService.create(nes, createROMLoader())
    const resetVector = 0xe683

    await romService.loadROM()

    const { rom, control } = nes.getComponents()
    const { memory } = control.getComponents()

    expect(rom?.getHeader()).not.toBe(null)
    expect(nes.isPowerOn()).toBe(true)
    expect(memory.getMemorySection(resetVector, resetVector + 5)).toEqual(expectedBytes)
  })

  test('should execute loadROM when debugger is active', async () => {
    const loadDebugger = LoadDebugger.create(nes)
    const romService = ROMService.create(nes, createROMLoader())

    await loadDebugger.execute()
    await romService.loadROM()

    const { nesDebugger } = nes.getComponents()
    const atResetVector = nesDebugger?.getState().conditions.atResetVector

    expect(nes.isPowerOn()).toBe(true)
    expect(atResetVector).toBe(true)
  })
})
