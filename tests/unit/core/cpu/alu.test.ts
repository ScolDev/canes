import ControlBus from 'src/nes/components/core/control-bus/control-bus'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type NESCpuComponent, type NESAluComponent } from 'src/nes/components/core/cpu/types'

describe('Tests for ALU module.', () => {
  let cpu: NESCpuComponent
  let cpuALU: NESAluComponent

  beforeEach(() => {
    const control = ControlBus.create()
    cpu = control.getComponents().cpu
    cpuALU = control.getComponents().alu
  })

  test('should get signed byte numbers.', () => {
    expect(cpuALU.getSignedByte(0xff)).toBe(-1)
    expect(cpuALU.getSignedByte(0x80)).toBe(-128)
    expect(cpuALU.getSignedByte(0x7f)).toBe(127)
    expect(cpuALU.getSignedByte(0x01)).toBe(1)
    expect(cpuALU.getSignedByte(0x00)).toBe(0)
  })

  test('should get flag values from P cpu register.', () => {
    cpu.setRegister(CPURegisters.P, 0b10000001)

    const carryFlag = cpuALU.getFlag(CPUFlags.CarryFlag)
    const zeroFlag = cpuALU.getFlag(CPUFlags.ZeroFlag)
    const negativeFlag = cpuALU.getFlag(CPUFlags.NegativeFlag)

    expect(carryFlag).toBe(1)
    expect(zeroFlag).toBe(0)
    expect(negativeFlag).toBe(1)
  })

  test('should set and clear a flag value into P cpu register.', () => {
    const initialValue = 0b01010001
    const finalValue = 0b11010010

    cpu.setRegister(CPURegisters.P, initialValue)

    cpuALU.clearFlag(CPUFlags.CarryFlag)
    cpuALU.setFlag(CPUFlags.ZeroFlag)
    cpuALU.clearFlag(CPUFlags.InterruptDisable)
    cpuALU.setFlag(CPUFlags.NegativeFlag)

    expect(cpu.getRegister(CPURegisters.P)).toBe(finalValue)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.InterruptDisable)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('should get bit values from number.', () => {
    const byteNumber = 0b01010101

    expect(cpuALU.getBitValue(1, byteNumber)).toBe(0)
    expect(cpuALU.getBitValue(6, byteNumber)).toBe(1)
  })
})
