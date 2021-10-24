export default () => {
  const signedByte = (byte) => {
    byte = byte & 0xff
    const value = byte & 0x7f
    const isNegative = !!((byte & 0x80) >> 7)

    if (isNegative) {
      return value - 0x80
    }
    return value
  }

  return {
    signedByte
  }
}
