import CPU from '../src/lib/cpu'
import CPU_ADDRESSING_MODES from '../src/lib/cpu-consts/cpu-addressing-modes'
import CPU_REGISTERS from '../src/lib/cpu-consts/cpu-registers'
import CPU_MEMORY_MAP from '../src/lib/cpu-consts/cpu-memory-map'
import CPU_DATA_SIZE from '../src/lib/cpu-consts/cpu-data-size'

describe('Test for CPU Addressing Modes', () => {
  let cpu

  beforeEach(() => {
    cpu = CPU()
  })

  test('should get data from Acumulator addressing mode.', () => {
    const acumulatorValue = 0xab
    cpu.setRegister(CPU_REGISTERS.A, acumulatorValue)

    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Acumulator)

    expect(value).toBe(acumulatorValue)
  })

  test('should get data from Immediate addressing mode.', () => {
    const immediateValue = 0xab
    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Immediate, immediateValue)

    expect(value).toBe(immediateValue)
  })

  test('should get data from Zero Page addressing mode.', () => {
    const memoryValue = 0x78
    const zeroPageOffset = 0x10
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + zeroPageOffset
    cpu.putMemoryValue(memoryAddress, memoryValue)

    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPage, zeroPageOffset)

    expect(value).toBe(memoryValue)
  })

  test('should get data from Zero Page, X addressing mode.', () => {
    const memoryValue = 0xbe
    const registerXValue = 0xff
    const zeroPageOffset = 0x80
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((zeroPageOffset + registerXValue) & 0xff)

    cpu.setRegister(CPU_REGISTERS.X, registerXValue)
    cpu.putMemoryValue(memoryAddress, memoryValue)

    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, zeroPageOffset)

    expect(value).toBe(memoryValue)
  })

  test('should get data from Zero Page, Y addressing mode.', () => {
    const memoryValue = 0xd7
    const registerYValue = 0xff
    const zeroPageOffset = 0x86
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((zeroPageOffset + registerYValue) & 0xff)

    cpu.setRegister(CPU_REGISTERS.Y, registerYValue)
    cpu.putMemoryValue(memoryAddress, memoryValue)

    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageY, zeroPageOffset)

    expect(value).toBe(memoryValue)
  })

  test('should get data from Relative addressing mode with negative operand.', () => {
    const signedValue = 0xff

    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Relative, signedValue)
    expect(value).toBe(-1)
  })

  test('should get data from Relative addressing mode with positive operand.', () => {
    const signedValue = 0x7f

    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Relative, signedValue)
    expect(value).toBe(127)
  })

  test('should get data from Absolute addressing mode.', () => {
    const memoryAddress = 0xabcd
    cpu.putMemoryValue(memoryAddress, 0x56)

    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Absolute, memoryAddress)
    expect(value).toBe(0x56)
  })

  test('should get data from Absolute, X addressing mode.', () => {
    const memoryAddress = 0xff10
    cpu.setRegister(CPU_REGISTERS.X, 0xff)

    cpu.putMemoryValue(memoryAddress + cpu.REG.X, 0x56)
    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, memoryAddress)

    expect(value).toBe(0x56)
  })

  test('should get data from Absolute, Y addressing mode.', () => {
    const memoryAddress = 0xff20
    cpu.setRegister(CPU_REGISTERS.Y, 0xff)

    cpu.putMemoryValue(memoryAddress + cpu.REG.Y, 0x56)
    const value = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteY, memoryAddress)
    expect(value).toBe(0x56)
  })

  test('should get data from Indirect addressing mode.', () => {
    const memoryAddress = 0xabcde
    cpu.putMemoryValue(memoryAddress, 0x1234, CPU_DATA_SIZE.Word)

    const LSB = cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
    const MSB = cpu.getMemoryValue(memoryAddress + 1, CPU_DATA_SIZE.Byte)
    const addressValue = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Indirect, memoryAddress)

    expect(LSB).toBe(0x34)
    expect(MSB).toBe(0x12)
    expect(addressValue).toBe(0x1234)
  })

  test('should get data from Indexed Indirect (d, x) addressing mode.', () => {
    const memoryAddress = 0x80a2
    const xRegistervalue = 0x10
    const zeroPageOffset = 0x10

    cpu.setRegister(CPU_REGISTERS.X, xRegistervalue)
    cpu.putMemoryValue(memoryAddress, 0xab, CPU_DATA_SIZE.Byte)
    cpu.putMemoryValue(zeroPageOffset + xRegistervalue, memoryAddress, CPU_DATA_SIZE.Word)

    const LSB = cpu.getMemoryValue(zeroPageOffset + xRegistervalue, CPU_DATA_SIZE.Byte)
    const MSB = cpu.getMemoryValue(zeroPageOffset + xRegistervalue + 1, CPU_DATA_SIZE.Byte)
    const memoryValue = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndexedIndirect, zeroPageOffset)

    expect(LSB).toBe(0xa2)
    expect(MSB).toBe(0x80)
    expect(memoryValue).toBe(0xab)
  })

  test('should get data from Indexed Indirect (d, x) addressing mode with Zero Page overflow.', () => {
    const memoryAddress = 0x8000
    const xRegistervalue = 0x00
    const zeroPageOffset = 0xff

    cpu.setRegister(CPU_REGISTERS.X, xRegistervalue)
    cpu.putMemoryValue(memoryAddress, 0xcd, CPU_DATA_SIZE.Byte)
    cpu.putMemoryValue(zeroPageOffset, 0x00, CPU_DATA_SIZE.Byte)
    cpu.putMemoryValue((zeroPageOffset + 1) & 0xff, 0x80, CPU_DATA_SIZE.Byte)

    const memoryValue = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndexedIndirect, zeroPageOffset)
    expect(memoryValue).toBe(0xcd)
  })

  test('should get data from Indirect Indexed (d), y addressing mode.', () => {
    const yRegisterValue = 0x05
    const zeroPagevalue = 0x8000
    const zeroPageOffset = 0x10

    cpu.setRegister(CPU_REGISTERS.Y, yRegisterValue)
    cpu.putMemoryValue(zeroPageOffset, zeroPagevalue, CPU_DATA_SIZE.Word)
    cpu.putMemoryValue(zeroPagevalue + yRegisterValue, 0xab, CPU_DATA_SIZE.Byte)

    const memoryValue = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndirectIndexed, zeroPageOffset)
    expect(memoryValue).toBe(0xab)
  })

  test('should get data from Indirect Indexed (d), y addressing mode with Zero Page overflow.', () => {
    const yRegisterValue = 0x05
    const zeroPagevalue = 0x8000
    const zeroPageOffset = 0xff

    cpu.setRegister(CPU_REGISTERS.Y, yRegisterValue)
    cpu.putMemoryValue(zeroPageOffset, 0x00, CPU_DATA_SIZE.Byte)
    cpu.putMemoryValue(0x00, 0x80, CPU_DATA_SIZE.Byte)
    cpu.putMemoryValue(zeroPagevalue + yRegisterValue, 0xab, CPU_DATA_SIZE.Byte)

    const memoryValue = cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndirectIndexed, zeroPageOffset)
    expect(memoryValue).toBe(0xab)
  })
})
