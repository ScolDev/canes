import CPU from '../src/lib/cpu'

import CPU_REGISTERS from '../src/lib/cpu-consts/cpu-registers'
import CPU_FLAGS from '../src/lib/cpu-consts/cpu-flags'
import CPU_ADDRESSING_MODES from '../src/lib/cpu-consts/cpu-addressing-modes'
import CPU_DATA_SIZE from '../src/lib/cpu-consts/cpu-data-size'
import CPU_MEMORY_MAP from '../src/lib/cpu-consts/cpu-memory-map'
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

  test('Emulate the BEQ instruction for Relative addressing mode.', () => {
    const address = 0x24
    const pcAddress = 0x902a
    const instruction = [0xf0, address]

    cpuALU.setFlag(CPU_FLAGS.ZeroFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x9050)
  })

  test('Emulate the BEQ instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xd2
    const pcAddress = 0x0012
    const instruction = [0xf0, address]

    cpuALU.setFlag(CPU_FLAGS.ZeroFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0xffe6)
  })

  test('Emulate the BEQ instruction for Relative addressing mode with ZeroFlag clear.', () => {
    const address = 0xba
    const pcAddress = 0xa021
    const instruction = [0xf0, address]

    cpuALU.setFlag(CPU_FLAGS.ZeroFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0xa023)
  })

  test('Emulate the BIT instruction for ZeroPage Addressing mode.', () => {
    const operand = 0b10010001
    const bitMask = 0b10000001
    const address = 0x47
    const instruction = [0x24, address]

    cpu.putMemoryValue(address, operand)
    cpu.setRegister(CPU_REGISTERS.A, bitMask)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('Emulate the BIT instruction for ZeroPage Addressing mode and result zero.', () => {
    const operand = 0b00010000
    const bitMask = 0b10000001
    const address = 0x12
    const instruction = [0x24, address]

    cpu.putMemoryValue(address, operand)
    cpu.setRegister(CPU_REGISTERS.A, bitMask)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the BIT instruction for Absolute Addressing mode.', () => {
    const operand = 0b10001011
    const bitMask = 0b00001011
    const address = 0xa712
    const instruction = [0x2c, address]

    cpu.putMemoryValue(address, operand)
    cpu.setRegister(CPU_REGISTERS.A, bitMask)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(1)
  })

  test('Emulate the BIT instruction for Absolute Addressing mode and result zero.', () => {
    const operand = 0b01010010
    const bitMask = 0b10001001
    const address = 0x91a4
    const instruction = [0x2c, address]

    cpu.putMemoryValue(address, operand)
    cpu.setRegister(CPU_REGISTERS.A, bitMask)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(1)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0)
  })

  test('Emulate the BMI instruction for Relative addressing mode.', () => {
    const address = 0x70
    const pcAddress = 0x7a10
    const instruction = [0x30, address]

    cpuALU.setFlag(CPU_FLAGS.NegativeFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x7a82)
  })

  test('Emulate the BMI instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xa2
    const pcAddress = 0x39a9
    const instruction = [0x30, address]

    cpuALU.setFlag(CPU_FLAGS.NegativeFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x394d)
  })

  test('Emulate the BMI instruction for Relative addressing mode with NegativeFlag clear.', () => {
    const address = 0x1a
    const pcAddress = 0x819a
    const instruction = [0x30, address]

    cpuALU.setFlag(CPU_FLAGS.NegativeFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x819c)
  })

  test('Emulate the BNE instruction for Relative addressing mode.', () => {
    const address = 0x3f
    const pcAddress = 0xa001
    const instruction = [0xd0, address]

    cpuALU.setFlag(CPU_FLAGS.ZeroFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0xa042)
  })

  test('Emulate the BNE instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xda
    const pcAddress = 0x8765
    const instruction = [0xd0, address]

    cpuALU.setFlag(CPU_FLAGS.ZeroFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x8741)
  })

  test('Emulate the BNE instruction for Relative addressing mode with ZeroFlag set.', () => {
    const address = 0x45
    const pcAddress = 0x3471
    const instruction = [0xd0, address]

    cpuALU.setFlag(CPU_FLAGS.ZeroFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x3473)
  })

  test('Emulate the BPL instruction for Relative addressing mode.', () => {
    const address = 0x10
    const pcAddress = 0xe020
    const instruction = [0x10, address]

    cpuALU.setFlag(CPU_FLAGS.NegativeFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0xe032)
  })

  test('Emulate the BPL instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xaf
    const pcAddress = 0x9004
    const instruction = [0x10, address]

    cpuALU.setFlag(CPU_FLAGS.NegativeFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x8fb5)
  })

  test('Emulate the BPL instruction for Relative addressing mode with NegativeFlag set.', () => {
    const address = 0x30
    const pcAddress = 0x9020
    const instruction = [0x10, address]

    cpuALU.setFlag(CPU_FLAGS.NegativeFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x9022)
  })

  test('Emulate the BRK instruction.', () => {
    const pStatus = 0b10100011
    const sPointer = 0xff
    const pcAddress = 0x4023
    const irqInterruptVector = 0x2a3f
    const instruction = [0x00, 0xff]

    cpu.setRegister(CPU_REGISTERS.P, pStatus)
    cpu.setRegister(CPU_REGISTERS.SP, sPointer)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.putMemoryValue(CPU_MEMORY_MAP.IRQ_Vector, irqInterruptVector, CPU_DATA_SIZE.Word)

    cpu.execute(instruction)

    expect(cpu.REG.SP).toBe(0xfd)
    expect(cpu.REG.PC).toBe(irqInterruptVector)
    expect(cpuALU.getFlag(CPU_FLAGS.BreakCommand)).toBe(0x1)

    expect(cpu.getMemoryValue(0x01fd)).toBe(0b10110011)
    expect(cpu.getMemoryValue(0x1ff)).toBe(0x25)
    expect(cpu.getMemoryValue(0x1fe)).toBe(0x40)
  })

  test('Emulate the BVC instruction for Relative addressing mode.', () => {
    const address = 0x34
    const pcAddress = 0x629b
    const instruction = [0x50, address]

    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x62d1)
  })

  test('Emulate the BVC instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xe1
    const pcAddress = 0x1035
    const instruction = [0x50, address]

    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x1018)
  })

  test('Emulate the BVC instruction for Relative addressing mode with OverflowFlag set.', () => {
    const address = 0x38
    const pcAddress = 0xc010
    const instruction = [0x50, address]

    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0xc012)
  })

  test('Emulate the BVS instruction for Relative addressing mode.', () => {
    const address = 0x28
    const pcAddress = 0x2432
    const instruction = [0x70, address]

    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x245c)
  })

  test('Emulate the BVS instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xa2
    const pcAddress = 0x329a
    const instruction = [0x70, address]

    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, 1)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x323e)
  })

  test('Emulate the BVS instruction for Relative addressing mode with OverflowFlag clear.', () => {
    const address = 0x26
    const pcAddress = 0xa001
    const instruction = [0x70, address]

    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, 0)
    cpu.setRegister(CPU_REGISTERS.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0xa003)
  })

  test('Emulate the CLC instruction for Implied addressing mode', () => {
    const instruction = [0x18]
    cpuALU.setFlag(CPU_FLAGS.CarryFlag)
    cpuALU.setFlag(CPU_FLAGS.NegativeFlag)
    cpuALU.setFlag(CPU_FLAGS.ZeroFlag)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
  })

  test('Emulate the CLD instruction for Implied addressing mode', () => {
    const instruction = [0xd8]
    cpuALU.setFlag(CPU_FLAGS.DecimalModeFlag)
    cpuALU.setFlag(CPU_FLAGS.NegativeFlag)
    cpuALU.setFlag(CPU_FLAGS.OverflowFlag)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.DecimalModeFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x01)
  })

  test('Emulate the CLI instruction for Implied addressing mode', () => {
    const instruction = [0x58]
    cpuALU.setFlag(CPU_FLAGS.InterruptDisable)
    cpuALU.setFlag(CPU_FLAGS.BreakCommand)
    cpuALU.setFlag(CPU_FLAGS.CarryFlag)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.BreakCommand)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
  })

  test('Emulate the CLV instruction for Implied addressing mode', () => {
    const instruction = [0xb8]
    cpuALU.setFlag(CPU_FLAGS.OverflowFlag)
    cpuALU.setFlag(CPU_FLAGS.ZeroFlag)
    cpuALU.setFlag(CPU_FLAGS.CarryFlag)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for Immediate addressing mode', () => {
    const operandA = 0x92
    const operandB = 0x7a
    const instruction = [0xc9, operandB]
    cpu.setRegister(CPU_REGISTERS.A, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Immediate addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xaf
    const operandB = 0xaf
    const instruction = [0xc9, operandB]
    cpu.setRegister(CPU_REGISTERS.A, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Immediate addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0xa0
    const operandB = 0x12
    const instruction = [0xc9, operandB]
    cpu.setRegister(CPU_REGISTERS.A, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for ZeroPage addressing mode', () => {
    const operandA = 0x58
    const operandB = 0x32
    const zeroPageOffset = 0x2a
    const instruction = [0xc5, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for ZeroPage addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x89
    const operandB = 0x89
    const zeroPageOffset = 0xa9
    const instruction = [0xc5, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for ZeroPage addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x48
    const operandB = 0xc3
    const zeroPageOffset = 0x82
    const instruction = [0xc5, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for ZeroPage, X addressing mode', () => {
    const operandA = 0xb4
    const operandB = 0x91
    const xIndex = 0x12
    const zeroPageOffset = 0x3b
    const instruction = [0xd5, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for ZeroPage, X addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xa0
    const operandB = 0xa0
    const xIndex = 0xa2
    const zeroPageOffset = 0xa9
    const instruction = [0xd5, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for ZeroPage, X addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x22
    const operandB = 0x88
    const xIndex = 0x71
    const zeroPageOffset = 0xd1
    const instruction = [0xd5, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for Absolute addressing mode', () => {
    const operandA = 0xc3
    const operandB = 0x90
    const memoryAddress = 0x2212
    const instruction = [0xcd, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xb4
    const operandB = 0xb4
    const memoryAddress = 0xe101
    const instruction = [0xcd, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x17
    const operandB = 0x61
    const memoryAddress = 0xe101
    const instruction = [0xcd, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for Absolute, X addressing mode', () => {
    const operandA = 0xc8
    const operandB = 0x74
    const xIndex = 0x26
    const memoryAddress = 0x7211
    const instruction = [0xdd, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operandB, memoryAddress)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute, X addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xde
    const operandB = 0xde
    const xIndex = 0x71
    const memoryAddress = 0xbabe
    const instruction = [0xdd, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operandB, memoryAddress)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute, X addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x10
    const operandB = 0x58
    const xIndex = 0xa1
    const memoryAddress = 0xc001
    const instruction = [0xdd, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operandB, memoryAddress)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for Absolute, Y addressing mode', () => {
    const operandA = 0xaa
    const operandB = 0x6a
    const yIndex = 0x26
    const memoryAddress = 0x00af
    const instruction = [0xd9, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteY, operandB, memoryAddress)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute, Y addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x09
    const operandB = 0x09
    const yIndex = 0xca
    const memoryAddress = 0x5600
    const instruction = [0xd9, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteY, operandB, memoryAddress)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute, Y addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x3a
    const operandB = 0x4f
    const yIndex = 0xb1
    const memoryAddress = 0xa0aa
    const instruction = [0xd9, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteY, operandB, memoryAddress)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for IndexedIndirect addressing mode', () => {
    const operandA = 0x90
    const operandB = 0x30
    const xIndex = 0x10
    const zeroPageOffset = 0x71
    const memoryAddress = 0x4010
    const instruction = [0xc1, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.putMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndexedIndirect, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for IndexedIndirect addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x11
    const operandB = 0x11
    const xIndex = 0x32
    const zeroPageOffset = 0x69
    const memoryAddress = 0x2299
    const instruction = [0xc1, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.putMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndexedIndirect, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for IndexedIndirect addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x16
    const operandB = 0x59
    const xIndex = 0x19
    const zeroPageOffset = 0xbf
    const memoryAddress = 0x3afc
    const instruction = [0xc1, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.putMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndexedIndirect, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for IndirectIndexed addressing mode', () => {
    const operandA = 0x7a
    const operandB = 0x49
    const yIndex = 0x12
    const zeroPageOffset = 0xac
    const memoryAddress = 0x3a9c
    const instruction = [0xd1, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.putMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndirectIndexed, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for IndirectIndexed addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x7a
    const operandB = 0x7a
    const yIndex = 0x32
    const zeroPageOffset = 0x69
    const memoryAddress = 0x10aa
    const instruction = [0xd1, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, yIndex)
    cpu.putMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndirectIndexed, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for IndirectIndexed addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x2a
    const operandB = 0x77
    const yIndex = 0x30
    const zeroPageOffset = 0xcc
    const memoryAddress = 0xff00
    const instruction = [0xd1, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, yIndex)
    cpu.putMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.IndirectIndexed, operandB, zeroPageOffset)
    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPX instruction for Immediate addressing mode', () => {
    const operandA = 0xa4
    const operandB = 0x38
    const instruction = [0xe0, operandB]
    cpu.setRegister(CPU_REGISTERS.X, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for Immediate addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x4a
    const operandB = 0x4a
    const instruction = [0xe0, operandB]
    cpu.setRegister(CPU_REGISTERS.X, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for Immediate addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0xc1
    const operandB = 0x10
    const instruction = [0xe0, operandB]
    cpu.setRegister(CPU_REGISTERS.X, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPX instruction for ZeroPage addressing mode', () => {
    const operandA = 0x60
    const operandB = 0x19
    const zeroPageOffset = 0xa0
    const instruction = [0xe4, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for ZeroPage addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xab
    const operandB = 0xab
    const zeroPageOffset = 0x37
    const instruction = [0xe4, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for ZeroPage addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x23
    const operandB = 0x91
    const zeroPageOffset = 0xc0
    const instruction = [0xe4, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPX instruction for Absolute addressing mode', () => {
    const operandA = 0x8a
    const operandB = 0x42
    const memoryAddress = 0x48ac
    const instruction = [0xec, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for Absolute addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x55
    const operandB = 0x55
    const memoryAddress = 0xff10
    const instruction = [0xec, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for Absolute addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x20
    const operandB = 0x7a
    const memoryAddress = 0x1010
    const instruction = [0xec, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPY instruction for Immediate addressing mode', () => {
    const operandA = 0xb2
    const operandB = 0x41
    const instruction = [0xc0, operandB]
    cpu.setRegister(CPU_REGISTERS.Y, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for Immediate addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x55
    const operandB = 0x55
    const instruction = [0xc0, operandB]
    cpu.setRegister(CPU_REGISTERS.Y, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for Immediate addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0xba
    const operandB = 0x23
    const instruction = [0xc0, operandB]
    cpu.setRegister(CPU_REGISTERS.Y, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPY instruction for ZeroPage addressing mode', () => {
    const operandA = 0x5a
    const operandB = 0x12
    const zeroPageOffset = 0xb0
    const instruction = [0xc4, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for ZeroPage addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xcd
    const operandB = 0xcd
    const zeroPageOffset = 0x49
    const instruction = [0xc4, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for ZeroPage addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x34
    const operandB = 0xa7
    const zeroPageOffset = 0x72
    const instruction = [0xc4, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operandB)
    cpu.setRegister(CPU_REGISTERS.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPY instruction for Absolute addressing mode', () => {
    const operandA = 0x8f
    const operandB = 0x4a
    const memoryAddress = 0x6a9a
    const instruction = [0xcc, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for Absolute addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x8a
    const operandB = 0x8a
    const memoryAddress = 0x1010
    const instruction = [0xcc, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for Absolute addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x32
    const operandB = 0x94
    const memoryAddress = 0x2394
    const instruction = [0xcc, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operandB)
    cpu.setRegister(CPU_REGISTERS.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for ZeroPage addressing mode', () => {
    const operand = 0x32
    const zeroPageOffset = 0x23
    const instruction = [0xc6, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0x31)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPage addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const zeroPageOffset = 0xfa
    const instruction = [0xc6, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPage addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0x00
    const zeroPageOffset = 0xd0
    const instruction = [0xc6, zeroPageOffset]

    cpu.putMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0xff)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for ZeroPageX addressing mode', () => {
    const operand = 0x74
    const xIndex = 30
    const zeroPageOffset = 0x74
    const instruction = [0xd6, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operand, zeroPageOffset)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset + xIndex)).toBe(0x73)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPageX addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const xIndex = 10
    const zeroPageOffset = 0x59
    const instruction = [0xd6, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operand, zeroPageOffset)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset + xIndex)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPageX addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xde
    const xIndex = 0xf0
    const zeroPageOffset = 0x03
    const instruction = [0xd6, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operand, zeroPageOffset)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset + xIndex)).toBe(0xdd)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for Absolute addressing mode', () => {
    const operand = 0x7f
    const memoryAddress = 0x573d
    const instruction = [0xce, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0x7e)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for Absolute addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const memoryAddress = 0x1235
    const instruction = [0xce, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for Absolute addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xa9
    const memoryAddress = 0x734c
    const instruction = [0xce, memoryAddress]

    cpu.putMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0xa8)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for AbsoluteX addressing mode', () => {
    const operand = 0x42
    const xIndex = 42
    const memoryAddress = 0x7423
    const instruction = [0xde, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operand, memoryAddress)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress + xIndex)).toBe(0x41)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for AbsoluteX addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const xIndex = 53
    const memoryAddress = 0x72ac
    const instruction = [0xde, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operand, memoryAddress)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress + xIndex)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for AbsoluteX addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xde
    const xIndex = 0x01
    const memoryAddress = 0xff00
    const instruction = [0xde, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operand, memoryAddress)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress + xIndex)).toBe(0xdd)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEX instruction for Implied addressing mode', () => {
    const operand = 0xa0
    const instruction = [0xca]

    cpu.setRegister(CPU_REGISTERS.X, operand)
    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(0x9f)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEY instruction for Implied addressing mode', () => {
    const operand = 0x01
    const instruction = [0x88]

    cpu.setRegister(CPU_REGISTERS.Y, operand)
    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })
})
