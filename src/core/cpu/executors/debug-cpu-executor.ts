import { type NESDebuggerComponent } from '../../../nes/components/debugger/types'
import { type NESModule } from '../../../nes/types'
import {
  type NESCpuComponent,
  type CPUState,
  type NESInstructionComponent,
  type CPUExecutor
} from '../types'

export class DebugCPUExecutor implements CPUExecutor {
  private readonly cpu: NESCpuComponent
  private readonly cpuInstruction: NESInstructionComponent
  private readonly nesDebugger: NESDebuggerComponent
  private readonly cpuState: CPUState

  private constructor (private readonly nes: NESModule) {
    const { cpu, nesDebugger } = this.nes.getComponents()
    const { instruction } = cpu.getComponents()

    this.cpu = cpu
    this.nesDebugger = nesDebugger
    this.cpuInstruction = instruction
    this.cpuState = this.cpu.getCPUState()
  }

  execute (): void {
    setTimeout(() => {
      this.runPRG()
    }, 0)
  }

  private runPRG (): void {
    for (let tick = 0; tick < 256; tick++) {
      this.nesDebugger.validate()

      if (!this.cpuState.paused) {
        this.cpu.executeCurrent()
      } else {
        this.setLastExecuted()
        break
      }
    }
    this.execute()
  }

  private setLastExecuted (): void {
    const lastExecuted = this.cpuInstruction.getLastExecuted()
    if (lastExecuted === undefined) return

    this.cpuState.lastExecuted = {
      opcode: lastExecuted.bytes[0],
      asm: lastExecuted.module.getASM(lastExecuted.bytes)
    }
  }

  static create (nes: NESModule): CPUExecutor {
    return new DebugCPUExecutor(nes)
  }
}
