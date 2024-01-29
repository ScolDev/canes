import {
  type NESCpuComponent,
  type NESAluComponent,
  type NESInstructionComponent,
  type NESAddrModesComponent,
  type CPUState
} from '../cpu/types/index'
import { Instruction } from '../cpu/components/instructions/instruction'
import { ALU } from '../cpu/components/alu'
import { CPU } from '../cpu/cpu'
import { type NESMemoryComponent } from '../memory/types'
import { Memory } from '../memory/memory'
import { NESBusRequests } from './consts/bus-events'
import { AddressingModes } from '../cpu/components/addressing-modes'
import { type NESControlBus, type NESBusRequest, type NESComponents } from './types'

export default class ControlBus implements NESControlBus {
  private readonly cpu: NESCpuComponent
  private readonly alu: NESAluComponent
  private readonly addressingModes: NESAddrModesComponent
  private readonly instruction: NESInstructionComponent
  private readonly memory: NESMemoryComponent
  private readonly cpuState: CPUState

  private constructor () {
    this.cpu = CPU.create(this)
    this.alu = ALU.create(this)
    this.memory = Memory.create(this)
    this.addressingModes = AddressingModes.create(this)
    this.instruction = Instruction.create(this)

    this.cpuState = this.cpu.getCPUState()
  }

  notify (request: NESBusRequest): void {
    if (request.type === NESBusRequests.SetFlag) {
      this.alu.setFlag(request.data.flag, request.data.value)
    } else if (request.type === NESBusRequests.Execute) {
      this.instruction.execute(request.data)
    } else if (request.type === NESBusRequests.Store) {
      this.memory.store(request.data.address, request.data.value)
    } else if (request.type === NESBusRequests.StoreByAddressingMode) {
      this.addressingModes.set(
        request.data.addrMode,
        request.data.value,
        request.data.operand
      )
    } else if (request.type === NESBusRequests.SetRegister) {
      this.cpu.setRegister(request.data.register, request.data.value)
    } else if (request.type === NESBusRequests.SetLastWrite) {
      const isDebugMode = this.cpuState.debugMode

      if (isDebugMode) {
        this.cpuState.lastWrite.address = request.data.address
        this.cpuState.lastWrite.value = request.data.value
      }
    } else if (request.type === NESBusRequests.AddCPUExtraCycles) {
      this.cpuState.clock.lastExtraCycles += request.data
    }
  }

  request<TResponse>(request: NESBusRequest): TResponse {
    let response

    if (request.type === NESBusRequests.LoadByAddressingMode) {
      response = this.addressingModes.get(
        request.data.addressingMode,
        request.data.operand
      )
    } else if (request.type === NESBusRequests.Load) {
      response = this.memory.load(request.data)
    } else if (request.type === NESBusRequests.LoadWord) {
      response = this.memory.loadWord(request.data)
    } else if (request.type === NESBusRequests.GetInstructionSize) {
      response = this.instruction.getInstructionSize(request.data)
    } else if (request.type === NESBusRequests.GetSignedByte) {
      response = this.alu.getSignedByte(request.data)
    } else if (request.type === NESBusRequests.GetPCRegister) {
      response = this.cpu.getPC()
    } else if (request.type === NESBusRequests.GetRegister) {
      response = this.cpu.getRegister(request.data)
    } else if (request.type === NESBusRequests.IsDebugMode) {
      response = this.cpu.getCPUState().debugMode
    } else if (request.type === NESBusRequests.HasCrossedPage) {
      response = this.memory.hasCrossedPage(
        request.data.actual,
        request.data.next
      )
    } else if (request.type === NESBusRequests.HasExtraCycle) {
      response = this.memory.hasExtraCycleByAddressingMode(
        request.data.addrMode,
        request.data.operand
      )
    }

    return response as TResponse
  }

  getComponents (): NESComponents {
    return {
      cpu: this.cpu,
      alu: this.alu,
      instruction: this.instruction,
      memory: this.memory
    }
  }

  static create (): NESControlBus {
    return new ControlBus()
  }
}
