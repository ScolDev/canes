import {
  type CPUInstruction,
  type CPUAddrModeTable,
  type InstructionsCpu,
  type InstructionsAlu,
  type InstructionsMemory
} from '../../types'

export abstract class BaseInstruction {
  protected readonly _cpu: InstructionsCpu
  protected readonly _cpuALU: InstructionsAlu
  protected readonly _memory: InstructionsMemory

  constructor (cpu: InstructionsCpu) {
    this._cpu = cpu

    const { cpuALU, memory } = this.cpu.getComponents()
    this._cpuALU = cpuALU
    this._memory = memory
  }

  public abstract readonly AddressingModes: CPUAddrModeTable
  public abstract execute (...args: CPUInstruction): void
  public updateStatus? (...args: number[]): void
  public abstract getASM (instruction: CPUInstruction): string

  protected get cpu (): InstructionsCpu {
    return this._cpu
  }

  protected get cpuALU (): InstructionsAlu {
    return this._cpuALU
  }

  protected get memory (): InstructionsMemory {
    return this._memory
  }
}
