import { type CPUFlag } from '../cpu/types'

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
