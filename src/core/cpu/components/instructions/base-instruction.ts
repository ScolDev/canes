import { getASMByAddrMode } from '../../consts/addressing-modes'
import {
  type CPUInstruction,
  type CPUAddrModeTable,
  type InstructionsCpu,
  type InstructionsAlu,
  type InstructionsMemory,
  type CPUState
} from '../../types'

export abstract class BaseInstruction {
  protected readonly _cpu: InstructionsCpu
  protected readonly _cpuState: CPUState
  protected readonly _cpuALU: InstructionsAlu
  protected readonly _memory: InstructionsMemory

  constructor (cpu: InstructionsCpu) {
    this._cpu = cpu

    const { cpuALU, memory } = this.cpu.getComponents()
    this._cpuALU = cpuALU
    this._memory = memory

    this._cpuState = cpu.getCPUState()
  }

  public abstract readonly name: string
  public abstract readonly AddressingModes: CPUAddrModeTable

  public abstract execute (...args: CPUInstruction): void
  public updateStatus? (...args: number[]): void

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `${this.name}${getASMByAddrMode(addressingMode, operand)}`
  }

  protected get cpu (): InstructionsCpu {
    return this._cpu
  }

  protected get cpuState (): CPUState {
    return this._cpuState
  }

  protected get cpuALU (): InstructionsAlu {
    return this._cpuALU
  }

  protected get memory (): InstructionsMemory {
    return this._memory
  }
}
