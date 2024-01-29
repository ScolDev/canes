import { NESBusRequests } from '../../../control-bus/consts/bus-events'
import { type NESControlBus } from '../../../control-bus/types'
import { type NESMemoryComponent } from '../../../memory/types'
import { getASMByAddrMode } from '../../consts/addressing-modes'
import {
  type CPUInstruction,
  type CPUAddrModeTable,
  type CPUAddrMode,
  type NESCpuComponent,
  type NESAluComponent
} from '../../types'

export abstract class BaseInstruction {
  protected readonly opcodesWithExtraCycles?: number[]
  protected readonly cpu: NESCpuComponent
  protected readonly memory: NESMemoryComponent
  protected readonly cpuALU: NESAluComponent

  constructor (private readonly control: NESControlBus) {
    const { cpu, memory, alu } = control.getComponents()
    this.cpu = cpu
    this.memory = memory
    this.cpuALU = alu
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

  protected addBranchExtraCycles (displacement: number): void {
    const currentPC = this.control.request<number>({
      type: NESBusRequests.GetPCRegister
    })
    const hasCrossedPage = this.control.request<boolean>({
      type: NESBusRequests.HasCrossedPage,
      data: {
        actual: currentPC,
        next: currentPC + displacement
      }
    })

    const extraCycles = hasCrossedPage ? 2 : 1
    this.control.notify({
      type: NESBusRequests.AddCPUExtraCycles,
      data: extraCycles
    })
  }

  protected addInstructionExtraCycles (
    addrMode: CPUAddrMode,
    opcode: number,
    operand: number
  ): void {
    if (
      this.opcodesWithExtraCycles === undefined ||
      !this.opcodesWithExtraCycles.includes(opcode)
    ) {
      return
    }

    const hasExtraCycle = this.control.request<boolean>({
      type: NESBusRequests.HasExtraCycle,
      data: {
        addrMode,
        operand
      }
    })
    const extraCycles = hasExtraCycle ? 1 : 0

    this.control.notify({
      type: NESBusRequests.AddCPUExtraCycles,
      data: extraCycles
    })
  }
}
