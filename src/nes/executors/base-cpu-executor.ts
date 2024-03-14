import { type CPUExecutor } from '../core/cpu/types'

export class BaseCPUExecutor implements CPUExecutor {
  private constructor () {}

  execute (): void {}

  static create (): CPUExecutor {
    return new BaseCPUExecutor()
  }
}
