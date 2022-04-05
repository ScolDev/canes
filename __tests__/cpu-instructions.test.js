import CPU from '../src/lib/cpu'

import CPU_REGISTERS from '../src/lib/cpu-consts/cpu-registers'
import CPU_FLAGS from '../src/lib/cpu-consts/cpu-flags'
import CPU_DATA_SIZE from '../src/lib/cpu-consts/cpu-data-size'
import CPU_ALU from '../src/lib/cpu-alu'

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

  test('Emulate the ADC instruction for ZeroPage without carry out but overflow.', () => {
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

  test('Emulate the ADC instruction for Absolute.', () => {
    const operandA = 0x12
    const operandB = 0x56
    const address = 0x789a
    const instruction = [0x6d, address]

    cpu.setRegister(CPU_REGISTERS.P, 0x00)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(address, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x68)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Absolute with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const address = 0xabcd
    const instruction = [0x6d, address]

    cpu.setRegister(CPU_REGISTERS.P, 0x01)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(address, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x14)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const address = 0xffaa
    const instruction = [0x6d, address]

    cpu.putMemoryValue(address, operandB)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x85)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute,X.', () => {
    const operandA = 0x12
    const operandB = 0x56
    const xIndex = 0x20
    const address = 0x7810
    const instruction = [0x7d, address]

    cpu.setRegister(CPU_REGISTERS.P, 0x00)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(address + xIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x68)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Absolute,X with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const xIndex = 0x20
    const address = 0xabcd
    const instruction = [0x7d, address]

    cpu.setRegister(CPU_REGISTERS.P, 0x01)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(address + xIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x14)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute,X without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const xIndex = 0x70
    const address = 0xffaa
    const instruction = [0x7d, address]

    cpu.putMemoryValue(address + xIndex, operandB)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x85)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute,Y.', () => {
    const operandA = 0x12
    const operandB = 0x56
    const yIndex = 0x20
    const address = 0x7810
    const instruction = [0x79, address]

    cpu.setRegister(CPU_REGISTERS.P, 0x00)
    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(address + yIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x68)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Absolute,Y with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const yIndex = 0x20
    const address = 0xabcd
    const instruction = [0x79, address]

    cpu.setRegister(CPU_REGISTERS.P, 0x01)
    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.putMemoryValue(address + yIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x14)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute,Y without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const yIndex = 0x70
    const address = 0xffaa
    const instruction = [0x79, address]

    cpu.putMemoryValue(address + yIndex, operandB)
    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x85)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for IndexedIndirect without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const xIndex = 0x10
    const address = 0xefa0
    const offsetZeroPage = 0xab
    const instruction = [0x61, offsetZeroPage]

    cpu.putMemoryValue(address, operandB)
    cpu.putMemoryValue(offsetZeroPage + xIndex, address, CPU_DATA_SIZE.Word)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x85)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for IndirectIndexed without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const yIndex = 0x10
    const address = 0xefa0
    const offsetZeroPage = 0xab
    const instruction = [0x71, offsetZeroPage]

    cpu.putMemoryValue(address + yIndex, operandB)
    cpu.putMemoryValue(offsetZeroPage, address, CPU_DATA_SIZE.Word)
    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x85)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
  })

  test('Emulate the ASL instruction for Accumulator addressing mode.', () => {
    const operand = 0x12
    const instruction = [0x0a]

    cpu.setRegister(CPU_REGISTERS.A, operand)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x24)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for Accumulator addressing mode with Carry and Zero flags set on.', () => {
    const operand = 0x80
    const instruction = [0x0a]

    cpu.setRegister(CPU_REGISTERS.A, operand)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for Accumulator addressing mode with Negative flag set on.', () => {
    const operand = 0x5a
    const instruction = [0x0a]

    cpu.setRegister(CPU_REGISTERS.A, operand)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xb4)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('Emulate the ASL instruction for ZeroPage addressing mode.', () => {
    const address = 0x4a
    const operandValue = 0x81
    const instruction = [0x06, address]

    cpu.putMemoryValue(address, operandValue)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(address)).toBe(0x02)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for ZeroPage,X addressing mode.', () => {
    const address = 0x54
    const xIndex = 0x20
    const operandValue = 0x23
    const instruction = [0x16, address]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.putMemoryValue(address + xIndex, operandValue)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(address + xIndex)).toBe(0x46)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for Absolute addressing mode.', () => {
    const address = 0x348a
    const operandValue = 0x9f
    const instruction = [0x0e, address]

    cpu.putMemoryValue(address, operandValue)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(address)).toBe(0x3e)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for Absolute,X addressing mode.', () => {
    const address = 0x92cf
    const operandValue = 0x00
    const instruction = [0x1e, address]

    cpu.putMemoryValue(address, operandValue)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(address)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the BCC instruction for Relative addressing mode.', () => {
    const address = 0x4e
    const pcAddress = 0x801f
    const instruction = [0x90, address]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x806f)
  })

  test('Emulate the BCC instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xa0
    const pcAddress = 0x801f
    const instruction = [0x90, address]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x7fc1)
  })

  test('Emulate the BCC instruction for Relative addressing mode with CarryFlag set.', () => {
    const address = 0xa0
    const pcAddress = 0x801f
    const instruction = [0x90, address]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x8021)
  })

  test('Emulate the BCS instruction for Relative addressing mode.', () => {
    const address = 0x72
    const pcAddress = 0x123f
    const instruction = [0xb0, address]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x12b3)
  })

  test('Emulate the BCS instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xc8
    const pcAddress = 0x34a2
    const instruction = [0xb0, address]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x346c)
  })

  test('Emulate the BCS instruction for Relative addressing mode with CarryFlag clear.', () => {
    const address = 0x23
    const pcAddress = 0x1001
    const instruction = [0xb0, address]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x1003)
  })
})
