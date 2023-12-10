import { CPU_FLAGS } from './consts/flags'
import { CPU_REGISTERS } from './consts/registers'

export class ALU {
  #cpu = null

  constructor (cpu) {
    this.#cpu = cpu
  }

  setFlag (flag, bitValue = 0x01) {
    const flagMask = (0x01 << flag) ^ 0xff
    const valueMask = bitValue << flag
    const pRegister = this.#cpu.getRegister(CPU_REGISTERS.P)
    const registerValue = valueMask + (pRegister & flagMask)

    this.#cpu.setRegister(CPU_REGISTERS.P, registerValue)
  }

  clearFlag (flag) {
    const byteMaskOff = (0x01 << flag) ^ 0xff
    const pRegister = this.#cpu.getRegister(CPU_REGISTERS.P)

    this.#cpu.setRegister(CPU_REGISTERS.P, pRegister & byteMaskOff)
  }

  getFlag (flag) {
    const pRegister = this.#cpu.getRegister(CPU_REGISTERS.P)
    return this.getBitValue(flag, pRegister)
  }

  getBitValue (bit, byteNumber) {
    return (byteNumber & (2 ** bit)) >> bit
  }

  getSignedByte (byte) {
    byte = byte & 0xff
    const value = byte & 0x7f
    const isNegative = !!((byte & 0x80) >> 7)

    if (isNegative) {
      return value - 0x80
    }
    return value
  }

  getTwoComplement (value) {
    return (0x100 - value) & 0xff
  }

  updateZeroFlag (result) {
    (result & 0xff) === 0x00
      ? this.setFlag(CPU_FLAGS.ZeroFlag)
      : this.clearFlag(CPU_FLAGS.ZeroFlag)
  }

  updateOverflowFlag (result, operandA, operandB) {
    const operandABit7 = operandA >> 7
    const operandBBit7 = operandB >> 7
    const resultBit7 = (result & 0xff) >> 7

    operandABit7 === operandBBit7 && resultBit7 !== operandABit7
      ? this.setFlag(CPU_FLAGS.OverflowFlag)
      : this.clearFlag(CPU_FLAGS.OverflowFlag)
  }

  updateNegativeFlag (result) {
    this.setFlag(CPU_FLAGS.NegativeFlag, this.getBitValue(0x07, result))
  }
}
