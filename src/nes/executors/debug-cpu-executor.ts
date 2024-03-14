import {
  type CPUExecutor,
  type NESCpuComponent,
  type CPUState
} from '../core/cpu/types'
import { type NESInstructionComponent } from '../core/instructions/types'
import { type NESDebuggerComponent } from '../debugger/types'
import { type NESModule } from '../types'

export class DebugCPUExecutor implements CPUExecutor {
  private readonly cpu: NESCpuComponent
  private readonly cpuInstruction: NESInstructionComponent
  private readonly nesDebugger: NESDebuggerComponent
  private readonly cpuState: CPUState
  private readonly CYCLES_PER_SECOND
  private nextTickCycles = 0

  private constructor (private readonly nes: NESModule) {
    const { control, nesDebugger } = this.nes.getComponents()
    const { cpu, instruction } = control.getComponents()

    if (nesDebugger === undefined) {
      throw Error('NES Debugger can not be undefined.')
    }

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

      if (!this.cpuState.isRunning) {
        return
      }

      const currentPC = this.cpu.getPC()
      const insBytes = this.cpuInstruction.fetchInstructionBytes(currentPC)
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

  static create (nes: NESModule): CPUExecutor {
    return new DebugCPUExecutor(nes)
  }
}
