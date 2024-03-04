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
import {
  type NESControlBus,
  type NESBusRequest,
  type NESComponents
} from './types'

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
    switch (request.type) {
      case NESBusRequests.SetFlag:
        this.alu.setFlag(request.data.flag, request.data.value)
        break

      case NESBusRequests.Execute:
        this.instruction.execute(request.data)
        break

      case NESBusRequests.Store:
        this.memory.store(request.data.address, request.data.value)
        break

      case NESBusRequests.StoreByAddressingMode:
        this.addressingModes.set(
          request.data.addrMode,
          request.data.value,
          request.data.operand
        )
        break

      case NESBusRequests.SetRegister:
        this.cpu.setRegister(request.data.register, request.data.value)
        break

      case NESBusRequests.SetLastWrite:
        if (this.cpuState.debugMode) {
          this.cpuState.lastWrite.address = request.data.address
          this.cpuState.lastWrite.value = request.data.value
        }
        break

      case NESBusRequests.AddCPUExtraCycles:
        this.cpuState.clock.lastExtraCycles += request.data
        break
    }
  }

  request<TResponse>(request: NESBusRequest): TResponse {
    let response

    switch (request.type) {
      case NESBusRequests.LoadByAddressingMode:
        response = this.addressingModes.get(
          request.data.addressingMode,
          request.data.operand
        )
        break

      case NESBusRequests.Load:
        response = this.memory.load(request.data)
        break

      case NESBusRequests.LoadWord:
        response = this.memory.loadWord(request.data)
        break

      case NESBusRequests.GetInstructionSize:
        response = this.instruction.getInstructionSize(request.data)
        break

      case NESBusRequests.GetSignedByte:
        response = this.alu.getSignedByte(request.data)
        break

      case NESBusRequests.GetPCRegister:
        response = this.cpu.getPC()
        break

      case NESBusRequests.GetRegister:
        response = this.cpu.getRegister(request.data)
        break

      case NESBusRequests.IsDebugMode:
        response = this.cpu.getCPUState().debugMode
        break

      case NESBusRequests.HasCrossedPage:
        response = this.memory.hasCrossedPage(
          request.data.actual,
          request.data.next
        )
        break

      case NESBusRequests.HasExtraCycle:
        response = this.memory.hasExtraCycleByAddressingMode(
          request.data.addrMode,
          request.data.operand
        )
        break
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
