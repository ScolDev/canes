import {
  type CPUState
} from '../../../../core/cpu/types'
import { type ReverseMap } from '../../../../shared/types'
import { type DebugEvents } from '../consts/events'
import { type NESDisASMComponent } from '../../disasm/types/index'

export interface DebugState {
  cpuState: CPUState
  conditions: DebugBreakConditions
}

export interface DebugBreakConditions {
  insExecuted: number
  atResetVector: boolean
  breakpoints: DebugBreakpoint[]
  memory: DebugMemoryBreakpoint[]
}

export type DebugBreakpoint = number
export type DebugSingleConditions = Partial<
Pick<DebugBreakConditions, 'insExecuted' | 'atResetVector'>
>
export interface DebugMemoryBreakpoint extends DebugConditionExpresion {
  address: number
  onWrite: boolean
}

export interface DebugConditionExpresion {
  equalsTo?: number
  greaterThanOrEquals?: number
  lessThanOrEquals?: number
}

export type DebugEventType = ReverseMap<typeof DebugEvents>
export type DebugEventCallback = (event: DebugEvent) => void
export interface DebugQueues {
  pause: DebugEventCallback[]
}
export interface DebugEvent {
  type: DebugEventType
  data: {
    pc: number
    cpuState: CPUState
  }
}

export interface NESDebuggerComponents {
  disASM: NESDisASMComponent
}

export interface NESDebuggerComponent {
  getComponents: () => NESDebuggerComponents
  run: () => void
  breakOn: (conditions: DebugSingleConditions) => void
  addBreakpoint: (breakpoint: DebugBreakpoint) => void
  addMemoryBreakpoint: (memoryBreakpoint: DebugMemoryBreakpoint) => void
  validate: () => void
  on: (event: DebugEventType, cb: DebugEventCallback) => void
}
