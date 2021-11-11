export default (cpu) => {
  const setFlag = (flag) => {
    const byteMaskOn = 0x01 << flag
    cpu.REG.P = cpu.REG.P | byteMaskOn
  }

  const clearFlag = (flag) => {
    const byteMaskOff = (0x01 << flag) ^ 0xff
    cpu.REG.P = cpu.REG.P & byteMaskOff
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

  return {
    getFlag,
    setFlag,
    clearFlag,
    getBitValue,
    getSignedByte
  }
}
