import CPU_ALU from '../src/lib/cpu-alu'

describe('Tests for CPU_ALU module.', () => {
  test('should get signed byte numbers.', () => {
    const { signedByte } = CPU_ALU

    expect(signedByte(0xff)).toBe(-1)
    expect(signedByte(0x80)).toBe(-128)
    expect(signedByte(0x7f)).toBe(127)
    expect(signedByte(0x01)).toBe(1)
    expect(signedByte(0x00)).toBe(0)
  })
})
