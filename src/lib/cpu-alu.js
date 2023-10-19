import CPU_FLAGS from './cpu-consts/cpu-flags'
import CPU_REGISTERS from './cpu-consts/cpu-registers'

export default (cpu) => {
  const setFlag = (flag, bitValue = 0x01) => {
    const flagMask = (0x01 << flag) ^ 0xff
    const valueMask = bitValue << flag
    const registerValue = valueMask + (cpu.REG.P & flagMask)

    cpu.setRegister(CPU_REGISTERS.P, registerValue)
  }

  const clearFlag = (flag) => {
    const byteMaskOff = (0x01 << flag) ^ 0xff
    cpu.setRegister(CPU_REGISTERS.P, cpu.REG.P & byteMaskOff)
  }

  const getFlag = (flag) => {
    return getBitValue(flag, cpu.REG.P)
  }

  const getBitValue = (bit, byteNumber) => {
    return (byteNumber & (2 ** bit)) >> bit
  }

  const getSignedByte = (byte) => {
    byte = byte & 0xff
    const value = byte & 0x7f
    const isNegative = !!((byte & 0x80) >> 7)

    if (isNegative) {
      return value - 0x80
    }
    return value
  }

  const getTwoComplement = (value) => {
    return (0x100 - value) & 0xff
  }

  const updateZeroFlag = (result) => {
    if ((result & 0xff) === 0x00) {
      setFlag(CPU_FLAGS.ZeroFlag)
    }
  }

  const updateOverflowFlag = (result, operandA, operandB) => {
    const operandABit7 = operandA >> 7
    const operandBBit7 = operandB >> 7
    const resultBit7 = (result & 0xff) >> 7

    if (operandABit7 === operandBBit7 && resultBit7 !== operandABit7) {
      setFlag(CPU_FLAGS.OverflowFlag)
    }
  }

  const updateNegativeFlag = (result) => {
    if (getBitValue(0x07, result) === 0x01) {
      setFlag(CPU_FLAGS.NegativeFlag)
    }
  }

  return {
    getFlag,
    setFlag,
    clearFlag,
    getBitValue,
    getSignedByte,
    getTwoComplement,
    updateZeroFlag,
    updateOverflowFlag,
    updateNegativeFlag
  }
}
