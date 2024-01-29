import {
  type CPUInstruction,
  type CPUFlag,
  type NESAluComponent,
  type NESCpuComponent,
  type NESInstructionComponent,
  type CPURegister,
  type CPUAddrMode
} from '../../cpu/types'
import { type NESMemoryComponent } from '../../memory/types'
import { type NESBusRequests } from '../consts/bus-events'

export type NESBusRequest =
  | { type: NESBusRequests.GetPCRegister }
  | { type: NESBusRequests.IsDebugMode }
  | {
    type: NESBusRequests.AddCPUExtraCycles
    data: number
  }
  | {
    type: NESBusRequests.Execute
    data: CPUInstruction
  }
  | {
    type: NESBusRequests.GetInstructionSize
    data: number
  }
  | {
    type: NESBusRequests.GetSignedByte
    data: number
  }
  | {
    type: NESBusRequests.GetRegister
    data: CPURegister
  }
  | {
    type: NESBusRequests.Load
    data: number
  }
  | {
    type: NESBusRequests.LoadWord
    data: number
  }
  | {
    type: NESBusRequests.LoadByAddressingMode
    data: {
      addressingMode: CPUAddrMode
      operand?: number
    }
  }
  | {
    type: NESBusRequests.SetFlag
    data: {
      flag: CPUFlag
      value?: number
    }
  }
  | {
    type: NESBusRequests.SetLastWrite
    data: {
      address: number
      value: number
    }
  }
  | {
    type: NESBusRequests.SetRegister
    data: {
      register: CPURegister
      value: number
    }
  }
  | {
    type: NESBusRequests.Store
    data: {
      address: number
      value: number
    }
  }
  | {
    type: NESBusRequests.StoreByAddressingMode
    data: {
      addrMode: CPUAddrMode
      value: number
      operand?: number
    }
  }
  | {
    type: NESBusRequests.HasCrossedPage
    data: {
      actual: number
      next: number
    }
  }
  | {
    type: NESBusRequests.HasExtraCycle
    data: {
      addrMode: CPUAddrMode
      operand: number
    }
  }
export type NESBusResponse = number | boolean

export interface NESComponents {
  cpu: NESCpuComponent
  alu: NESAluComponent
  instruction: NESInstructionComponent
  memory: NESMemoryComponent
}

export interface NESControlBus {
  getComponents: () => NESComponents
  notify: (request: NESBusRequest) => void
  request: <TResponse>(request: NESBusRequest) => TResponse
}
