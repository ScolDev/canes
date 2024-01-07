import { CPUAddressingModes } from '../../../../src/core/cpu/consts/addressing-modes'
import { CPURegisters } from '../../../../src/core/cpu/consts/registers'
import { CPU } from '../../../../src/core/cpu/cpu'
import { type NESCpuModule } from '../../../../src/core/cpu/types'
import { CPUMemoryMap } from '../../../../src/core/memory/consts/memory-map'
import { type NESMemory } from '../../../../src/core/memory/types'

describe('Test for CPU Addressing Modes', () => {
  let cpu: NESCpuModule
  let memory: NESMemory

  beforeEach(() => {
    cpu = CPU.create()
    memory = cpu.getComponents().memory
  })

  test('should get data from Accumulator addressing mode.', () => {
    const acumulatorValue = 0xab
    cpu.setRegister(CPURegisters.A, acumulatorValue)

    const value = memory.loadByAddressingMode(CPUAddressingModes.Accumulator)

    expect(value).toBe(acumulatorValue)
  })

  test('should get data from Immediate addressing mode.', () => {
    const immediateValue = 0xab
    const value = memory.loadByAddressingMode(
      CPUAddressingModes.Immediate,
      immediateValue
    )

    expect(value).toBe(immediateValue)
  })

  test('should get data from Zero Page addressing mode.', () => {
    const memoryValue = 0x78
    const zeroPageOffset = 0x10
    const memoryAddress = CPUMemoryMap.ZeroPage + zeroPageOffset
    memory.store(memoryAddress, memoryValue)

    const value = memory.loadByAddressingMode(
      CPUAddressingModes.ZeroPage,
      zeroPageOffset
    )

    expect(value).toBe(memoryValue)
  })

  test('should get data from Zero Page, X addressing mode.', () => {
    const memoryValue = 0xbe
    const registerXValue = 0xff
    const zeroPageOffset = 0x80
    const memoryAddress =
      CPUMemoryMap.ZeroPage + ((zeroPageOffset + registerXValue) & 0xff)

    cpu.setRegister(CPURegisters.X, registerXValue)
    memory.store(memoryAddress, memoryValue)

    const value = memory.loadByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      zeroPageOffset
    )

    expect(value).toBe(memoryValue)
  })

  test('should get data from Zero Page, Y addressing mode.', () => {
    const memoryValue = 0xd7
    const registerYValue = 0xff
    const zeroPageOffset = 0x86
    const memoryAddress =
      CPUMemoryMap.ZeroPage + ((zeroPageOffset + registerYValue) & 0xff)

    cpu.setRegister(CPURegisters.Y, registerYValue)
    memory.store(memoryAddress, memoryValue)

    const value = memory.loadByAddressingMode(
      CPUAddressingModes.ZeroPageY,
      zeroPageOffset
    )

    expect(value).toBe(memoryValue)
  })

  test('should get data from Relative addressing mode with negative operand.', () => {
    const signedValue = 0xff

    const value = memory.loadByAddressingMode(
      CPUAddressingModes.Relative,
      signedValue
    )
    expect(value).toBe(-1)
  })

  test('should get data from Relative addressing mode with positive operand.', () => {
    const signedValue = 0x7f

    const value = memory.loadByAddressingMode(
      CPUAddressingModes.Relative,
      signedValue
    )
    expect(value).toBe(127)
  })

  test('should get data from Absolute addressing mode.', () => {
    const memoryAddress = 0xabcd
    memory.store(memoryAddress, 0x56)

    const value = memory.loadByAddressingMode(
      CPUAddressingModes.Absolute,
      memoryAddress
    )
    expect(value).toBe(0x56)
  })

  test('should get data from Absolute, X addressing mode.', () => {
    const memoryAddress = 0xff10
    cpu.setRegister(CPURegisters.X, 0xff)

    memory.store(memoryAddress + cpu.getRegister(CPURegisters.X), 0x56)
    const value = memory.loadByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      memoryAddress
    )

    expect(value).toBe(0x56)
  })

  test('should get data from Absolute, Y addressing mode.', () => {
    const memoryAddress = 0xff20
    cpu.setRegister(CPURegisters.Y, 0xff)

    memory.store(memoryAddress + cpu.getRegister(CPURegisters.Y), 0x56)
    const value = memory.loadByAddressingMode(
      CPUAddressingModes.AbsoluteY,
      memoryAddress
    )
    expect(value).toBe(0x56)
  })

  test('should get data from Indirect addressing mode.', () => {
    const memoryAddress = 0xabcde
    memory.storeWord(memoryAddress, 0x1234)

    const LSB = memory.load(memoryAddress)
    const MSB = memory.load(memoryAddress + 1)
    const addressValue = memory.loadByAddressingMode(
      CPUAddressingModes.Indirect,
      memoryAddress
    )

    expect(LSB).toBe(0x34)
    expect(MSB).toBe(0x12)
    expect(addressValue).toBe(0x1234)
  })

  test('should get data from Indexed Indirect (d, x) addressing mode.', () => {
    const memoryAddress = 0x80a2
    const xRegistervalue = 0x10
    const zeroPageOffset = 0x10

    cpu.setRegister(CPURegisters.X, xRegistervalue)
    memory.store(memoryAddress, 0xab)
    memory.storeWord(zeroPageOffset + xRegistervalue, memoryAddress)

    const LSB = memory.load(zeroPageOffset + xRegistervalue)
    const MSB = memory.load(zeroPageOffset + xRegistervalue + 1)
    const memoryValue = memory.loadByAddressingMode(
      CPUAddressingModes.IndexedIndirect,
      zeroPageOffset
    )

    expect(LSB).toBe(0xa2)
    expect(MSB).toBe(0x80)
    expect(memoryValue).toBe(0xab)
  })

  test('should get data from Indexed Indirect (d, x) addressing mode with Zero Page overflow.', () => {
    const memoryAddress = 0x8000
    const xRegistervalue = 0x00
    const zeroPageOffset = 0xff

    cpu.setRegister(CPURegisters.X, xRegistervalue)
    memory.store(memoryAddress, 0xcd)
    memory.store(zeroPageOffset, 0x00)
    memory.store((zeroPageOffset + 1) & 0xff, 0x80)

    const memoryValue = memory.loadByAddressingMode(
      CPUAddressingModes.IndexedIndirect,
      zeroPageOffset
    )
    expect(memoryValue).toBe(0xcd)
  })

  test('should get data from Indirect Indexed (d), y addressing mode.', () => {
    const yRegisterValue = 0x05
    const zeroPagevalue = 0x8000
    const zeroPageOffset = 0x10

    cpu.setRegister(CPURegisters.Y, yRegisterValue)
    memory.storeWord(zeroPageOffset, zeroPagevalue)
    memory.storeWord(zeroPagevalue + yRegisterValue, 0xab)

    const memoryValue = memory.loadByAddressingMode(
      CPUAddressingModes.IndirectIndexed,
      zeroPageOffset
    )
    expect(memoryValue).toBe(0xab)
  })

  test('should get data from Indirect Indexed (d), y addressing mode with Zero Page overflow.', () => {
    const yRegisterValue = 0x05
    const zeroPagevalue = 0x8000
    const zeroPageOffset = 0xff

    cpu.setRegister(CPURegisters.Y, yRegisterValue)
    memory.store(zeroPageOffset, 0x00)
    memory.store(0x00, 0x80)
    memory.store(zeroPagevalue + yRegisterValue, 0xab)

    const memoryValue = memory.loadByAddressingMode(
      CPUAddressingModes.IndirectIndexed,
      zeroPageOffset
    )
    expect(memoryValue).toBe(0xab)
  })
})
