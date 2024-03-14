import { type CPURegisters } from './consts/registers'
import { type ReverseMap } from 'src/shared/types'
import { type CPUFlags } from './consts/flags'
import { type CPUInstruction } from '../instructions/types'
import { type CPUAddrMode } from '../addressing-modes/types'

export type CPURegister = ReverseMap<typeof CPURegisters>
export type CPUFlag = ReverseMap<typeof CPUFlags>

export interface CPUState {
  clock: {
    frequency: number
    cycles: number
    lastExtraCycles: number
    lastInstructionCycles: number
  }
  isRunning: boolean
  debugMode: boolean
  insExecuted: number
  lastWrite: CPULastWrite
}

export interface CPULastWrite {
  address: number
  value: number
}

export interface CPUExecutor {
  execute: () => void
}

export interface NESCpuComponent {
  execute: (instruction: CPUInstruction) => void
  nextPC: (addressingMode: CPUAddrMode, displacement?: number) => void
  setPC: (address: number) => void
  getPC: () => number
  getCPUState: () => CPUState
  getRegister: (register: CPURegister) => number
  isDebugged: () => boolean
  setRegister: (register: CPURegister, value: number) => void
  powerUp: () => void
  reset: () => void
  setDebugMode: (status: boolean) => void
  setExecutor: (executor: CPUExecutor) => void
}
