export default (cpu) => {
  const getFlag = (flag) => {
    return getBitValue(flag, cpu.REG.P)
  }

  const getBitValue = (bit, register) => {
    return (register & (2 ** bit)) >> bit
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
    getBitValue,
    getSignedByte
  }
}
