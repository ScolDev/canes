import { type CPURegisters } from '../consts/registers'
import { type ReverseMap } from '../../../shared/types'
import { type CPUAddressingModes } from '../consts/addressing-modes'
import { type CPUFlags } from '../consts/flags'
import { type BaseInstruction } from '../components/instructions/base-instruction'
import { type ROMSource } from '../../rom/types'
import { type Debugger } from '../../debugger/debugger'
import { type NESMemory, type NESMemoryModule } from '../../memory/types'

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

export interface NESComponents {
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

export interface NESAluModule {
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

export type NESAlu = NESAluModule | undefined

export interface NESAddrModesModule {
  initComponents: () => void
  get: (addressingMode: CPUAddrMode, operand?: number) => number
  set: (addressingMode: CPUAddrMode, value: number, operand: number) => void
}

export type NESAddrModes = NESAddrModesModule | undefined

export interface NESInstructionModule {
  execute: (instruction: CPUInstruction) => void
  getInstructionSize: (opcode: number) => number
  getLastExecuted: () => LastExecutedInstruction
}

export interface LastExecutedInstruction {
  bytes: CPUInstruction
  module: BaseInstruction
}

export type NESInstruction = NESInstructionModule | undefined

export interface NESCpuModule {
  initComponents: () => void
  getComponents: () => NESComponents
  debug: (_debugger: Debugger) => void
  execute: (instruction: CPUInstruction) => void
  nextPC: (addressingMode: CPUAddrMode, displacement?: number) => void
  setPC: (address: number) => void
  getPC: () => number
  getCPUState: () => CPUState
  getRegister: (register: CPURegister) => number
  setRegister: (register: CPURegister, value: number) => void
  loadROM: (romSource: ROMSource) => Promise<void>
  powerUp: () => void
  reset: () => void
}

export type ALUCpu = Pick<NESCpuModule, 'getRegister' | 'setRegister'>

export type AddrModesCpu = Pick<
NESCpuModule,
'getComponents' | 'getRegister' | 'setRegister' | 'getCPUState'
>
export type AddrModesAlu = Pick<NESAluModule, 'getSignedByte'>

export type InstructionsCpu = Pick<
NESCpuModule,
| 'getComponents'
| 'getRegister'
| 'setRegister'
| 'nextPC'
| 'setPC'
>
export type InstructionsAlu = NESAluModule | undefined
export type InstructionsMemory =
  | Pick<
  NESMemoryModule,
  | 'loadAddressByAddressingMode'
  | 'load'
  | 'loadByAddressingMode'
  | 'loadWord'
  | 'store'
  | 'storeWord'
  | 'storeByAddressingMode'
  >
  | undefined
