import { type CPURegisters } from '../consts/registers'
import { type ReverseMap } from '../../../shared/types'
import { type CPUAddressingModes } from '../consts/addressing-modes'
import { type CPUFlags } from '../consts/flags'
import { type BaseInstruction } from '../components/instructions/base-instruction'
import { type NESMemory, type NESMemoryComponent } from '../../memory/types'
import { type NESDebuggerComponent } from '../../../nes/components/debugger/types'

export type CPURegister = ReverseMap<typeof CPURegisters>
export type CPUFlag = ReverseMap<typeof CPUFlags>
export type CPUAddrMode = ReverseMap<typeof CPUAddressingModes>
export type CPUAddrModeTable = Record<number, CPUAddrMode>
export type CPUInstruction = [opcode: number, operand?: number]
export type CPUInstructionTable = Record<number, BaseInstruction>

export interface CPUAddrModeHandler {
  get: (...args: number[]) => number
  set?: (...args: number[]) => void
}

export interface NESCpuComponents {
  cpuALU: NESAlu
  memory: NESMemory
}

export interface CPUState {
  paused: boolean
  debugMode: boolean
  insExecuted: number
  lastExecuted: CPULastExecuted
  lastWrite: CPULastWrite
}

export interface CPULastWrite {
  address: number
  value: number
}

export interface CPULastExecuted {
  opcode: number
  asm: string
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

export type NESAlu = NESAluComponent | undefined

export interface NESAddrModesComponent {
  initComponents: () => void
  get: (addressingMode: CPUAddrMode, operand?: number) => number
  set: (addressingMode: CPUAddrMode, value: number, operand: number) => void
}

export type NESAddrModes = NESAddrModesComponent | undefined

export interface NESInstructionComponent {
  execute: (instruction: CPUInstruction) => void
  getInstructionSize: (opcode: number) => number
  getLastExecuted: () => LastExecutedInstruction
}

export interface LastExecutedInstruction {
  bytes: CPUInstruction
  module: BaseInstruction
}

export type NESInstruction = NESInstructionComponent | undefined

export interface NESCpuComponent {
  initComponents: () => void
  getComponents: () => NESCpuComponents
  debug: (_debugger: NESDebuggerComponent) => void
  execute: (instruction: CPUInstruction) => void
  nextPC: (addressingMode: CPUAddrMode, displacement?: number) => void
  setPC: (address: number) => void
  getPC: () => number
  getCPUState: () => CPUState
  getRegister: (register: CPURegister) => number
  setRegister: (register: CPURegister, value: number) => void
  powerUp: () => void
  reset: () => void
}

export type ALUCpu = Pick<NESCpuComponent, 'getRegister' | 'setRegister'>

export type AddrModesCpu = Pick<
NESCpuComponent,
'getComponents' | 'getRegister' | 'setRegister' | 'getCPUState'
>
export type AddrModesAlu = Pick<NESAluComponent, 'getSignedByte'>

export type InstructionsCpu = Pick<
NESCpuComponent,
| 'getComponents'
| 'getRegister'
| 'setRegister'
| 'nextPC'
| 'setPC'
>
export type InstructionsAlu = NESAluComponent | undefined
export type InstructionsMemory =
  | Pick<
  NESMemoryComponent,
  | 'loadAddressByAddressingMode'
  | 'load'
  | 'loadByAddressingMode'
  | 'loadWord'
  | 'store'
  | 'storeWord'
  | 'storeByAddressingMode'
  >
  | undefined
