import { type BaseInstruction } from './base-instruction'

export type CPUInstruction = [opcode: number, operand?: number]
export type CPUInstructionTable = Record<number, BaseInstruction>
export type CPUCyclesTable = Record<number, number>

export interface NESInstructionComponent {
  execute: (instruction: CPUInstruction) => void
  fetchInstructionBytes: (fromAddress: number) => CPUInstruction
  getInstructionCycles: (instructin: CPUInstruction) => number
  getInstructionSize: (opcode: number) => number
}
