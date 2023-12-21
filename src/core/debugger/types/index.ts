import { type ReverseMap } from '../../../shared/types'
import { type NESCpuModule, type CPUState } from '../../cpu/types'
import { type DebugEvents } from '../consts/events'

export interface DebugState {
  cpuState: CPUState | null
  conditions: DebugBreakConditions
}

export interface DebugBreakConditions {
  insExecuted: number
  atResetVector: boolean
  breakpoints: DebugBreakpoint[]
  memory: DebugMemoryBreakpoint[]
}

export type DebugSingleConditions = Partial<Pick<DebugBreakConditions, 'insExecuted' | 'atResetVector'>>
export type DebugBreakpoint = number
export interface DebugMemoryBreakpoint extends DebugConditionExpresion {
  address: number
  onWrite: boolean
}

export interface DebugConditionExpresion {
  equalsTo?: number
  greaterThanOrEquals?: number
  lessThanOrEquals?: number
}

export type DebugEventType = ReverseMap<DebugEvents>
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

export interface NESDebuggerModule {
  attach: (cpuToAttach: DebugCpu) => void
  run: () => void
  breakOn: (conditions: DebugSingleConditions) => void
  addBreakpoint: (breakpoint: DebugBreakpoint) => void
  addMemoryBreakpoint: (memoryBreakpoint: DebugMemoryBreakpoint) => void
  validate: () => void
  on: (event: DebugEventType, cb: DebugEventCallback) => void
}

export type NESDebugger = NESDebuggerModule | undefined

export type DebugCpu = Pick<NESCpuModule, 'debug' | 'getComponents' | 'getCPUState' | 'getPC' | 'powerUp'> | undefined
