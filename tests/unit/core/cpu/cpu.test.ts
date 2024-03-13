import ControlBus from 'src/nes/components/core/control-bus/control-bus'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type NESAluComponent, type NESCpuComponent } from 'src/nes/components/core/cpu/types'
import { CPUMemoryMap } from 'src/nes/components/core/memory/consts/memory-map'
import { type NESMemoryComponent } from 'src/nes/components/core/memory/types'

describe('Tests for CPU module.', () => {
  let cpuALU: NESAluComponent
  let memory: NESMemoryComponent
  let cpu: NESCpuComponent

  beforeEach(() => {
    const control = ControlBus.create()

    cpu = control.getComponents().cpu
    cpuALU = control.getComponents().alu
    memory = control.getComponents().memory
  })

  test('should load CPU module.', () => {
    expect(cpu).toBeDefined()
  })

  test('should set the PC register.', () => {
    const value = 0xabcd
    cpu.setRegister(CPURegisters.PC, value)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(value)
  })

  test('should set the PC register keeping the 16-bit size.', () => {
    const value = 0xabcdef
    cpu.setRegister(CPURegisters.PC, value)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0xcdef)
  })

  test('should set the SP register.', () => {
    const value = 0xab
    cpu.setRegister(CPURegisters.SP, value)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(value)
  })

  test('should set the SP register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPURegisters.SP, value)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(0xcd)
  })

  test('should set the A register.', () => {
    const value = 0xab
    cpu.setRegister(CPURegisters.A, value)

    expect(cpu.getRegister(CPURegisters.A)).toBe(value)
  })

  test('should set the A register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPURegisters.A, value)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xcd)
  })

  test('should set the X register.', () => {
    const value = 0xab
    cpu.setRegister(CPURegisters.X, value)

    expect(cpu.getRegister(CPURegisters.X)).toBe(value)
  })

  test('should set the X register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPURegisters.X, value)

    expect(cpu.getRegister(CPURegisters.X)).toBe(0xcd)
  })

  test('should set the Y register.', () => {
    const value = 0xab
    cpu.setRegister(CPURegisters.Y, value)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(value)
  })

  test('should set the Y register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPURegisters.Y, value)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(0xcd)
  })

  test('should set the P register.', () => {
    const value = 0xab
    cpu.setRegister(CPURegisters.P, value)

    expect(cpu.getRegister(CPURegisters.P)).toBe(value)
  })

  test('should set the P register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPURegisters.P, value)

    expect(cpu.getRegister(CPURegisters.P)).toBe(0xcd)
  })

  test('should set the P register and all status flags are setted to 1.', () => {
    const value = 0xff
    cpu.setRegister(CPURegisters.P, value)

    expect(cpu.getRegister(CPURegisters.P)).toBe(0xff)

    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.InterruptDisable)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.BreakCommand)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('should set the P register and all status flags are setted to 0.', () => {
    const value = 0x00
    cpu.setRegister(CPURegisters.P, value)

    expect(cpu.getRegister(CPURegisters.P)).toBe(0x00)

    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.InterruptDisable)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.BreakCommand)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('should set the P register with 1 and 0 values in the status flags.', () => {
    const value = 0b10101010
    cpu.setRegister(CPURegisters.P, value)

    expect(cpu.getRegister(CPURegisters.P)).toBe(0b10101010)

    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.InterruptDisable)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.BreakCommand)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('should power-up the cpu', () => {
    memory.storeWord(CPUMemoryMap.Reset_Vector, 0x8000)
    cpu.powerUp()

    expect(cpu.getRegister(CPURegisters.P)).toBe(0x34)
    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpu.getRegister(CPURegisters.X)).toBe(0x00)
    expect(cpu.getRegister(CPURegisters.Y)).toBe(0x00)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(0xfd)
    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x8000)

    expect(memory.load(0x4015)).toBe(0x00)
    expect(memory.load(0x4017)).toBe(0x00)
    expect(memory.getMemorySection(0x4000, 0x400f)).toEqual(
      new Uint8Array(0x10)
    )
    expect(memory.getMemorySection(0x4010, 0x4013)).toEqual(
      new Uint8Array(0x04)
    )
  })

  test('should reset the cpu', () => {
    const previousX = 0x31
    const previousY = 0xf1
    const previousA = 0xca
    const previousSP = 0xf0
    const previousP = 0b11001010
    const dummyByte = 0xfa

    cpu.setRegister(CPURegisters.X, previousX)
    cpu.setRegister(CPURegisters.Y, previousY)
    cpu.setRegister(CPURegisters.A, previousA)
    cpu.setRegister(CPURegisters.SP, previousSP)
    cpu.setRegister(CPURegisters.P, previousP)

    memory.store(0x0000, dummyByte)
    memory.store(0x0102, dummyByte)
    memory.store(0x07ff, dummyByte)

    memory.store(0x4015, dummyByte)
    memory.store(0x4017, dummyByte)
    memory.storeWord(CPUMemoryMap.Reset_Vector, 0x8000)

    const previousInternalMemory = memory.getMemorySection(0x0000, 0x07ff)

    cpu.reset()

    expect(cpu.getRegister(CPURegisters.A)).toBe(previousA)
    expect(cpu.getRegister(CPURegisters.X)).toBe(previousX)
    expect(cpu.getRegister(CPURegisters.Y)).toBe(previousY)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(previousSP - 0x03)
    expect(cpu.getRegister(CPURegisters.P)).toBe(0b11001110)
    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x8000)

    expect(memory.load(0x4015)).toBe(0x00)
    expect(memory.load(0x4017)).toBe(dummyByte)
    expect(previousInternalMemory).toEqual(
      memory.getMemorySection(0x0000, 0x07ff)
    )
  })
})
