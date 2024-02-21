import { type CPUInstruction } from '../core/cpu/types'

export interface CodeRange {
  start: number
  numOfLines: number
}

export interface DisASMLine {
  asm: string
  address: number
  bytes: CPUInstruction
}

export interface NESDisASMComponent {
  read: (range: CodeRange) => DisASMLine[]
}
