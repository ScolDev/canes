import CPU_REGISTERS from '../src/lib/cpu-consts/cpu-registers'
import CPU_FLAGS from '../src/lib/cpu-consts/cpu-flags'
import CPU from '../src/lib/cpu'
import CPU_ALU from '../src/lib/cpu-alu'

describe('Tests for CPU_ALU module.', () => {
  let cpu
  let cpuALU

  beforeEach(() => {
    cpu = CPU()
    cpuALU = CPU_ALU(cpu)
  })

  test('should get signed byte numbers.', () => {
    expect(cpuALU.getSignedByte(0xff)).toBe(-1)
    expect(cpuALU.getSignedByte(0x80)).toBe(-128)
    expect(cpuALU.getSignedByte(0x7f)).toBe(127)
    expect(cpuALU.getSignedByte(0x01)).toBe(1)
    expect(cpuALU.getSignedByte(0x00)).toBe(0)
  })

  test('should get flag values from P cpu register.', () => {
    cpu.setRegister(CPU_REGISTERS.P, 0b10000001)

    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    const zeroFlag = cpuALU.getFlag(CPU_FLAGS.ZeroFlag)
    const negativeFlag = cpuALU.getFlag(CPU_FLAGS.NegativeFlag)

    expect(carryFlag).toBe(1)
    expect(zeroFlag).toBe(0)
    expect(negativeFlag).toBe(1)
  })

  test('should set and clear a flag value into P cpu register.', () => {
    const initialValue = 0b01010001
    const finalValue = 0b11010010

    cpu.setRegister(CPU_REGISTERS.P, initialValue)

    cpuALU.clearFlag(CPU_FLAGS.CarryFlag)
    cpuALU.setFlag(CPU_FLAGS.ZeroFlag)
    cpuALU.clearFlag(CPU_FLAGS.InterruptDisable)
    cpuALU.setFlag(CPU_FLAGS.NegativeFlag)

    expect(cpu.REG.P).toBe(finalValue)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('should get bit values from number.', () => {
    const byteNumber = 0b01010101

    expect(cpuALU.getBitValue(1, byteNumber)).toBe(0)
    expect(cpuALU.getBitValue(6, byteNumber)).toBe(1)
  })
})
