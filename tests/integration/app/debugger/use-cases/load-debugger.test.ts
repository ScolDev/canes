import LoadDebugger from 'src/app/debugger/uses-cases/load-debugger'
import { DebuggerNotLoaded } from 'src/app/disasm/errors/debugger-not-loaded'
import LoadROM from 'src/app/nes/use-cases/load-rom'
import { NES } from 'src/nes/nes'
import { type NESModule } from 'src/nes/types'
import { createROMLoader } from 'tests/integration/helpers'

describe('NES debugger use cases', () => {
  let nes: NESModule

  beforeEach(() => {
    nes = NES.create()
  })

  test('should execute the LoadDebugger use case', async () => {
    const loadDebugger = LoadDebugger.create(nes)

    await loadDebugger.execute()

    const { nesDebugger } = nes.getComponents()

    if (nesDebugger === undefined) {
      throw new DebuggerNotLoaded()
    }

    const { atResetVector } = nesDebugger.getState().conditions
    const { debugMode } = nesDebugger.getState().cpuState

    expect(debugMode).toBe(true)
    expect(atResetVector).toBe(true)
    expect(nes.isPowerOn()).toBe(false)
  })

  test('should execute the LoadDebugger use case when the NES is power on', async () => {
    const loadDebugger = LoadDebugger.create(nes)
    const loadROM = LoadROM.create(nes, createROMLoader())

    await loadROM.execute()
    await loadDebugger.execute()

    const { nesDebugger } = nes.getComponents()

    if (nesDebugger === undefined) {
      throw new DebuggerNotLoaded()
    }

    const { atResetVector } = nesDebugger.getState().conditions
    const { debugMode } = nesDebugger.getState().cpuState

    expect(debugMode).toBe(true)
    expect(atResetVector).toBe(false)
    expect(nes.isPowerOn()).toBe(false)
  })
})
