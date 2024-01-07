import { CPUFlags } from '../consts/flags'
import { CPURegisters } from '../consts/registers'
import { type CPUFlag, type ALUCpu, type NESAluComponent } from '../types'

export class ALU implements NESAluComponent {
  private readonly cpu: ALUCpu

  private constructor (cpu: ALUCpu) {
    this.cpu = cpu
  }

  setFlag (flag: CPUFlag, bitValue = 0x01): void {
    const flagMask = (0x01 << flag) ^ 0xff
    const valueMask = bitValue << flag
    const pRegister = this.cpu.getRegister(CPURegisters.P)
    const registerValue = valueMask + (pRegister & flagMask)

    this.cpu.setRegister(CPURegisters.P, registerValue)
  }

  clearFlag (flag: CPUFlag): void {
    const byteMaskOff = (0x01 << flag) ^ 0xff
    const pRegister = this.cpu.getRegister(CPURegisters.P)

    this.cpu.setRegister(CPURegisters.P, pRegister & byteMaskOff)
  }

  getFlag (flag: CPUFlag): number {
    const pRegister = this.cpu.getRegister(CPURegisters.P)
    return this.getBitValue(flag, pRegister)
  }

  getBitValue (bit: number, byte: number): number {
    return (byte & (2 ** bit)) >> bit
  }

  getSignedByte (byte: number): number {
    byte = byte & 0xff
    const value = byte & 0x7f
    return byte >= 0x80 ? value - 0x80 : value
  }

  getTwoComplement (byte: number): number {
    return (0x100 - byte) & 0xff
  }

  updateZeroFlag (result: number): void {
    (result & 0xff) === 0x00
      ? this.setFlag(CPUFlags.ZeroFlag)
      : this.clearFlag(CPUFlags.ZeroFlag)
  }

  updateOverflowFlag (result: number, operandA: number, operandB: number): void {
    const operandABit7 = operandA >> 7
    const operandBBit7 = operandB >> 7
    const resultBit7 = (result & 0xff) >> 7

    operandABit7 === operandBBit7 && resultBit7 !== operandABit7
      ? this.setFlag(CPUFlags.OverflowFlag)
      : this.clearFlag(CPUFlags.OverflowFlag)
  }

  updateNegativeFlag (result: number): void {
    this.setFlag(CPUFlags.NegativeFlag, this.getBitValue(0x07, result))
  }

  static create (cpu: ALUCpu): NESAluComponent {
    return new ALU(cpu)
  }
}
