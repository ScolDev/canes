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
  private readonly CYCLES_PER_SECOND
  private nextTickCycles = 0

  private constructor (private readonly nes: NESModule) {
    const { cpu, nesDebugger } = this.nes.getComponents()
    const { instruction } = cpu.getComponents()

    this.cpu = cpu
    this.nesDebugger = nesDebugger
    this.cpuInstruction = instruction
    this.cpuState = this.cpu.getCPUState()

    this.CYCLES_PER_SECOND = this.cpuState.clock.frequency
  }

  execute (): void {
    this.nextTickCycles = this.cpuState.clock.cycles + this.CYCLES_PER_SECOND

    setTimeout(() => {
      this.runPRG()
    }, 0)
  }

  private runPRG (): void {
    while (this.cpuState.clock.cycles < this.nextTickCycles) {
      this.nesDebugger.validate()

      if (this.cpuState.paused) {
        this.onPause()
        return
      }

      // Strategy:
      // execute / counting cycles

      const insBytes = this.cpu.fetchInstructionBytes()
      const baseCycles = this.cpuInstruction.getInstructionCycles(insBytes)

      this.cpuState.clock.lastExtraCycles = 0
      this.cpu.execute(insBytes)

      const { lastExtraCycles } = this.cpuState.clock
      const takenCycles = baseCycles + lastExtraCycles

      this.cpuState.clock.cycles += takenCycles
      this.cpuState.clock.lastInstructionCycles = takenCycles
    }

    this.execute()
  }

  private onPause (): void {
    this.setLastExecuted()
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
