import { CPU } from '../../src/core/cpu/cpu'

import { CPU_REGISTERS } from '../../src/core/cpu/consts/registers'
import { CPU_FLAGS } from '../../src/core/cpu/consts/flags'
import { ALU } from '../../src/core/cpu/alu'
import { CPU_MEMORY_MAP } from '../../src/core/cpu/consts/memory-map'

describe('Tests for CPU module.', () => {
  let cpu
  let cpuALU

  beforeEach(() => {
    cpu = CPU()
    cpuALU = ALU(cpu)
  })

  test('should load CPU module.', () => {
    expect(cpu).toBeDefined()
  })

  test('should set the PC register.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.PC, value)

    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(value)
  })

  test('should set the PC register keeping the 16-bit size.', () => {
    const value = 0xabcdef
    cpu.setRegister(CPU_REGISTERS.PC, value)

    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0xcdef)
  })

  test('should set the SP register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.SP, value)

    expect(cpu.getRegister(CPU_REGISTERS.SP)).toBe(value)
  })

  test('should set the SP register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.SP, value)

    expect(cpu.getRegister(CPU_REGISTERS.SP)).toBe(0xcd)
  })

  test('should set the A register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.A, value)

    expect(cpu.getRegister(CPU_REGISTERS.A)).toBe(value)
  })

  test('should set the A register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.A, value)

    expect(cpu.getRegister(CPU_REGISTERS.A)).toBe(0xcd)
  })

  test('should set the X register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.X, value)

    expect(cpu.getRegister(CPU_REGISTERS.X)).toBe(value)
  })

  test('should set the X register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.X, value)

    expect(cpu.getRegister(CPU_REGISTERS.X)).toBe(0xcd)
  })

  test('should set the Y register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.Y, value)

    expect(cpu.getRegister(CPU_REGISTERS.Y)).toBe(value)
  })

  test('should set the Y register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.Y, value)

    expect(cpu.getRegister(CPU_REGISTERS.Y)).toBe(0xcd)
  })

  test('should set the P register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.getRegister(CPU_REGISTERS.P)).toBe(value)
  })

  test('should set the P register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.getRegister(CPU_REGISTERS.P)).toBe(0xcd)
  })

  test('should set the P register and all status flags are setted to 1.', () => {
    const value = 0xff
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.getRegister(CPU_REGISTERS.P)).toBe(0xff)

    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.BreakCommand)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('should set the P register and all status flags are setted to 0.', () => {
    const value = 0x00
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.getRegister(CPU_REGISTERS.P)).toBe(0x00)

    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.BreakCommand)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('should set the P register with 1 and 0 values in the status flags.', () => {
    const value = 0b10101010
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.getRegister(CPU_REGISTERS.P)).toBe(0b10101010)

    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.BreakCommand)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('should power-up the cpu', () => {
    cpu.storeWord(CPU_MEMORY_MAP.Reset_Vector, 0x8000)
    cpu.powerUp()

    expect(cpu.getRegister(CPU_REGISTERS.P)).toBe(0x34)
    expect(cpu.getRegister(CPU_REGISTERS.A)).toBe(0x00)
    expect(cpu.getRegister(CPU_REGISTERS.X)).toBe(0x00)
    expect(cpu.getRegister(CPU_REGISTERS.Y)).toBe(0x00)
    expect(cpu.getRegister(CPU_REGISTERS.SP)).toBe(0xfd)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8000)

    expect(cpu.load(0x4015)).toBe(0x00)
    expect(cpu.load(0x4017)).toBe(0x00)
    expect(cpu.getMemorySection(0x4000, 0x400f)).toEqual(new Uint8Array(0x10))
    expect(cpu.getMemorySection(0x4010, 0x4013)).toEqual(new Uint8Array(0x04))
  })

  test('should reset the cpu', () => {
    const previousX = 0x31
    const previousY = 0xf1
    const previousA = 0xca
    const previousSP = 0xf0
    const previousP = 0b11001010
    const dummyByte = 0xfa

    cpu.setRegister(CPU_REGISTERS.X, previousX)
    cpu.setRegister(CPU_REGISTERS.Y, previousY)
    cpu.setRegister(CPU_REGISTERS.A, previousA)
    cpu.setRegister(CPU_REGISTERS.SP, previousSP)
    cpu.setRegister(CPU_REGISTERS.P, previousP)

    cpu.store(0x0000, dummyByte)
    cpu.store(0x0102, dummyByte)
    cpu.store(0x07ff, dummyByte)

    cpu.store(0x4015, dummyByte)
    cpu.store(0x4017, dummyByte)
    cpu.storeWord(CPU_MEMORY_MAP.Reset_Vector, 0x8000)

    const previousInternalMemory = cpu.getMemorySection(0x0000, 0x07ff)

    cpu.reset()

    expect(cpu.getRegister(CPU_REGISTERS.A)).toBe(previousA)
    expect(cpu.getRegister(CPU_REGISTERS.X)).toBe(previousX)
    expect(cpu.getRegister(CPU_REGISTERS.Y)).toBe(previousY)
    expect(cpu.getRegister(CPU_REGISTERS.SP)).toBe(previousSP - 0x03)
    expect(cpu.getRegister(CPU_REGISTERS.P)).toBe(0b11001110)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8000)

    expect(cpu.load(0x4015)).toBe(0x00)
    expect(cpu.load(0x4017)).toBe(dummyByte)
    expect(previousInternalMemory).toEqual(cpu.getMemorySection(0x0000, 0x07ff))
  })
})
