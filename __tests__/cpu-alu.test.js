import CPU_ALU from '../src/lib/cpu-alu'

describe('Tests for CPU_ALU module.', () => {
  let cpuALU

  beforeEach(() => {
    cpuALU = CPU_ALU()
  })

  test('should get signed byte numbers.', () => {
    expect(cpuALU.signedByte(0xff)).toBe(-1)
    expect(cpuALU.signedByte(0x80)).toBe(-128)
    expect(cpuALU.signedByte(0x7f)).toBe(127)
    expect(cpuALU.signedByte(0x01)).toBe(1)
    expect(cpuALU.signedByte(0x00)).toBe(0)
  })
})
