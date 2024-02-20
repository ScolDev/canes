import { type CPURegisters } from '../consts/registers'
import { type ReverseMap } from '../../../shared/types'
import { type CPUAddressingModes } from '../consts/addressing-modes'
import { type CPUFlags } from '../consts/flags'
import { type BaseInstruction } from '../components/instructions/base-instruction'

export type CPURegister = ReverseMap<typeof CPURegisters>
export type CPUFlag = ReverseMap<typeof CPUFlags>
export type CPUAddrMode = ReverseMap<typeof CPUAddressingModes>
export type CPUAddrModeTable = Record<number, CPUAddrMode>
export type CPUCyclesTable = Record<number, number>
export type CPUInstruction = [opcode: number, operand?: number]
export type CPUInstructionTable = Record<number, BaseInstruction>

export interface CPUAddrModeHandler {
  get: (...args: number[]) => number
  set?: (...args: number[]) => void
}

export interface CPUState {
  clock: {
    frequency: number
    cycles: number
    lastExtraCycles: number
    lastInstructionCycles: number
  }
  paused: boolean
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

export interface NESAluComponent {
  setFlag: (flag: CPUFlag, bitValue?: number) => void
  clearFlag: (flag: CPUFlag) => void
  getFlag: (flag: CPUFlag) => number
  getBitValue: (bit: number, byte: number) => number
  getSignedByte: (byte: number) => number
  getTwoComplement: (byte: number) => number
  updateZeroFlag: (result: number) => void
  updateOverflowFlag: (
    result: number,
    operandA: number,
    operandB: number
  ) => void
  updateNegativeFlag: (result: number) => void
}

export interface NESAddrModesComponent {
  get: (addressingMode: CPUAddrMode, operand?: number) => number
  set: (addressingMode: CPUAddrMode, value: number, operand?: number) => void
}

export interface NESInstructionComponent {
  execute: (instruction: CPUInstruction) => void
  fetchInstructionBytes: (fromAddress: number) => CPUInstruction
  getInstructionASM: (instruction: CPUInstruction, address: number) => string
  getInstructionCycles: (instructin: CPUInstruction) => number
  getInstructionSize: (opcode: number) => number
}

export interface NESCpuComponent {
  execute: (instruction: CPUInstruction) => void
  nextPC: (addressingMode: CPUAddrMode, displacement?: number) => void
  setPC: (address: number) => void
  getPC: () => number
  getCPUState: () => CPUState
  getRegister: (register: CPURegister) => number
  setRegister: (register: CPURegister, value: number) => void
  powerUp: () => void
  reset: () => void
  setDebugMode: (status: boolean) => void
  setExecutor: (executor: CPUExecutor) => void
}
