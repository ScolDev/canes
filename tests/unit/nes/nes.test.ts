import { DebugCPUExecutor } from 'src/nes/executors/debug-cpu-executor'
import { ExecutorInitFailed } from 'src/nes/executors/errors/executor-init-failed'
import { NES } from 'src/nes/nes'
import { type NESModule } from 'src/nes/types'

describe('Tests for NES Module', () => {
  let nes: NESModule

  beforeEach(() => {
    nes = NES.create()
  })

  test('should throw an ExecutorInitFailed error', () => {
    try {
      const { cpu } = nes.getComponents().control
      cpu.setExecutor(DebugCPUExecutor.create(nes))

      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(ExecutorInitFailed)
    }
  })
})
