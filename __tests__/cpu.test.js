import CPU from '../src/lib/cpu'

import CPU_REGISTERS from '../src/lib/cpu-consts/cpu-registers'
import CPU_FLAGS from '../src/lib/cpu-consts/cpu-flags'
import CPU_ADDRESSING_MODES from '../src/lib/cpu-consts/cpu-addressing-modes'
import CPU_MEMORY_MAP from '../src/lib/cpu-consts/cpu-mempry-map'
import CPU_DATA_SIZE from '../src/lib/cpu-consts/cpu-data-size'
import CPU_ALU from '../src/lib/cpu-alu'

describe('Tests for CPU module.', () => {
  let cpu
  let cpuALU

  beforeEach(() => {
    cpu = CPU()
    cpuALU = CPU_ALU(cpu)
  })
  test('should load CPU module.', () => {
    expect(cpu).toBeDefined()
  })

  test('should have a memory map.', () => {
    const memory = cpu.MEM

    expect(memory).toBeDefined()
    expect(memory.length).toBe(0xffff)
  })

  test('should set the PC register.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.PC, value)

    expect(cpu.REG.PC).toBe(value)
  })

  test('should set the PC register keeping the 16-bit size.', () => {
    const value = 0xabcdef
    cpu.setRegister(CPU_REGISTERS.PC, value)

    expect(cpu.REG.PC).toBe(0xcdef)
  })

  test('should set the SP register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.SP, value)

    expect(cpu.REG.SP).toBe(value)
  })

  test('should set the SP register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.SP, value)

    expect(cpu.REG.SP).toBe(0xcd)
  })

  test('should set the A register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.A, value)

    expect(cpu.REG.A).toBe(value)
  })

  test('should set the A register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.A, value)

    expect(cpu.REG.A).toBe(0xcd)
  })

  test('should set the X register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.X, value)

    expect(cpu.REG.X).toBe(value)
  })

  test('should set the X register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.X, value)

    expect(cpu.REG.X).toBe(0xcd)
  })

  test('should set the Y register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.Y, value)

    expect(cpu.REG.Y).toBe(value)
  })

  test('should set the Y register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.Y, value)

    expect(cpu.REG.Y).toBe(0xcd)
  })

  test('should set the P register.', () => {
    const value = 0xab
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.REG.P).toBe(value)
  })

  test('should set the P register keeping the 8-bit size.', () => {
    const value = 0xabcd
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.REG.P).toBe(0xcd)
  })

  test('should set the P register and all status flags are setted to 1.', () => {
    const value = 0xff
    cpu.setRegister(CPU_REGISTERS.P, value)

    expect(cpu.REG.P).toBe(0xff)

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

    expect(cpu.REG.P).toBe(0x00)

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

    expect(cpu.REG.P).toBe(0b10101010)

    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.BreakCommand)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
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

describe('CPU Instructions', () => {
  let cpu
  let cpuALU

  beforeEach(() => {
    cpu = CPU()
    cpuALU = CPU_ALU(cpu)
  })

  test('Emulate the AND instruction for Inmediate', () => {
    const instruction = [0x29, 0xff]
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for Inmediate with NegativeFlag set to 1', () => {
    const instruction = [0x29, 0xa9]
    cpu.setRegister(CPU_REGISTERS.A, 0x80)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x80)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('Emulate the AND instruction for ZeroPage', () => {
    const address = 0x12
    const memoryValue = 0x78
    const instruction = [0x25, address]

    cpu.setRegister(CPU_REGISTERS.A, 0x2d)
    cpu.putMemoryValue(address, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x28)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for ZeroPage, X', () => {
    const address = 0x45
    const memoryValue = 0xab
    const instruction = [0x35, address]

    cpu.setRegister(CPU_REGISTERS.A, 0x9a)
    cpu.setRegister(CPU_REGISTERS.X, 0x10)
    cpu.putMemoryValue(address + cpu.REG.X, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x8a)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('Emulate the AND instruction for ZeroPage, X for overflow.', () => {
    const address = 0xff
    const memoryValue = 0xff
    const instruction = [0x35, address]

    cpu.setRegister(CPU_REGISTERS.A, 0x00)
    cpu.setRegister(CPU_REGISTERS.X, 0x10)
    cpu.putMemoryValue(address + cpu.REG.X, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for Absolute.', () => {
    const address = 0x1234
    const memoryValue = 0x18
    const instruction = [0x2d, address]

    cpu.setRegister(CPU_REGISTERS.A, 0x46)
    cpu.putMemoryValue(address, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for Absolute, X.', () => {
    const address = 0xffff
    const memoryValue = 0x95
    const instruction = [0x3d, address]

    cpu.setRegister(CPU_REGISTERS.A, 0xd3)
    cpu.setRegister(CPU_REGISTERS.X, 0x3f)
    cpu.putMemoryValue((address + cpu.REG.X) & 0xffff, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x91)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('Emulate the AND instruction for Absolute, Y.', () => {
    const address = 0xffff
    const memoryValue = 0x95
    const instruction = [0x39, address]

    cpu.setRegister(CPU_REGISTERS.A, 0xd3)
    cpu.setRegister(CPU_REGISTERS.Y, 0x3f)
    cpu.putMemoryValue((address + cpu.REG.Y) & 0xffff, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x91)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('Emulate the AND instruction for IndexedIndirect.', () => {
    const address = 0x38ad
    const operand = 0x0a
    const memoryValue = 0x03
    const instruction = [0x21, operand]

    cpu.setRegister(CPU_REGISTERS.A, 0x92)
    cpu.setRegister(CPU_REGISTERS.X, 0x14)

    cpu.putMemoryValue(address, memoryValue)
    cpu.putMemoryValue((operand + cpu.REG.X) & 0xff, address, CPU_DATA_SIZE.Word)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x02)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for IndexedIndirect.', () => {
    const address = 0x38ad
    const operand = 0x0a
    const memoryValue = 0xfa
    const instruction = [0x31, operand]

    cpu.setRegister(CPU_REGISTERS.A, 0x13)
    cpu.setRegister(CPU_REGISTERS.Y, 0x4a)

    cpu.putMemoryValue(address + cpu.REG.Y, memoryValue)
    cpu.putMemoryValue((operand) & 0xff, address, CPU_DATA_SIZE.Word)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x12)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Immediate.', () => {
    const operandA = 0x12
    const operandB = 0x34
    const instruction = [0x69, operandB]

    cpu.setRegister(CPU_REGISTERS.P, 0x00)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x46)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Immediate with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const instruction = [0x69, operandB]

    cpu.setRegister(CPU_REGISTERS.P, 0x01)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x14)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Immediate without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x45
    const instruction = [0x69, operandB]

    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x95)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for ZeroPage.', () => {
    const operandA = 0x12
    const operandB = 0x34
    const zeroPageOffset = 0x78
    const instruction = [0x65, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.P, 0x00)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x46)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for ZeroPage with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const zeroPageOffset = 0xab
    const instruction = [0x65, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.P, 0x01)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x14)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Immediate without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const zeroPageOffset = 0xff
    const instruction = [0x65, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x85)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for ZeroPage,X.', () => {
    const operandA = 0x12
    const operandB = 0x34
    const xIndex = 0x05
    const zeroPageOffset = 0x78
    const instruction = [0x75, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.P, 0x00)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(zeroPageOffset + xIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x46)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for ZeroPage,X with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const xIndex = 0x05
    const zeroPageOffset = 0xab
    const instruction = [0x75, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.P, 0x01)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(zeroPageOffset + xIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x14)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for ZeroPage,X without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const xIndex = 0x05
    const zeroPageOffset = 0xff
    const instruction = [0x75, zeroPageOffset]

    cpu.putMemoryValue((zeroPageOffset + xIndex) & 0xff, operandB)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x85)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })
})
