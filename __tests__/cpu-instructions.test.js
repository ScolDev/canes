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
    cpu.setMemoryValue(address, memoryValue)
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
    cpu.setMemoryValue(address + cpu.REG.X, memoryValue)
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
    cpu.setMemoryValue(address + cpu.REG.X, memoryValue)
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
    cpu.setMemoryValue(address, memoryValue)
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
    cpu.setMemoryValue((address + cpu.REG.X) & 0xffff, memoryValue)
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
    cpu.setMemoryValue((address + cpu.REG.Y) & 0xffff, memoryValue)
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

    cpu.setMemoryValue(address, memoryValue)
    cpu.setMemoryValue((operand + cpu.REG.X) & 0xff, address, CPU_DATA_SIZE.Word)

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

    cpu.setMemoryValue(address + cpu.REG.Y, memoryValue)
    cpu.setMemoryValue((operand) & 0xff, address, CPU_DATA_SIZE.Word)

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
    cpu.setMemoryValue(zeroPageOffset, operandB)
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
    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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
    cpu.setMemoryValue(zeroPageOffset + xIndex, operandB)
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
    cpu.setMemoryValue(zeroPageOffset + xIndex, operandB)
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

    cpu.setMemoryValue((zeroPageOffset + xIndex) & 0xff, operandB)
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
    cpu.setMemoryValue(address, operandB)
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
    cpu.setMemoryValue(address, operandB)
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

    cpu.setMemoryValue(address, operandB)
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
    cpu.setMemoryValue(address + xIndex, operandB)
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
    cpu.setMemoryValue(address + xIndex, operandB)
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

    cpu.setMemoryValue(address + xIndex, operandB)
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
    cpu.setMemoryValue(address + yIndex, operandB)
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
    cpu.setMemoryValue(address + yIndex, operandB)
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

    cpu.setMemoryValue(address + yIndex, operandB)
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

    cpu.setMemoryValue(address, operandB)
    cpu.setMemoryValue(offsetZeroPage + xIndex, address, CPU_DATA_SIZE.Word)
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

    cpu.setMemoryValue(address + yIndex, operandB)
    cpu.setMemoryValue(offsetZeroPage, address, CPU_DATA_SIZE.Word)
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

    cpu.setMemoryValue(address, operandValue)
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
    cpu.setMemoryValue(address + xIndex, operandValue)
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

    cpu.setMemoryValue(address, operandValue)
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

    cpu.setMemoryValue(address, operandValue)
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

    cpu.setMemoryValue(address, operand)
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

    cpu.setMemoryValue(address, operand)
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

    cpu.setMemoryValue(address, operand)
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

    cpu.setMemoryValue(address, operand)
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
    cpu.setMemoryValue(CPU_MEMORY_MAP.IRQ_Vector, irqInterruptVector, CPU_DATA_SIZE.Word)

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

    expect(cpuALU.getFlag(CPU_FLAGS.DecimalModeFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x01)
  })

  test('Emulate the CLD instruction for Implied addressing mode with previous DecimalModeFlag disabled', () => {
    const instruction = [0xd8]

    cpuALU.clearFlag(CPU_FLAGS.DecimalModeFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.DecimalModeFlag)).toBe(0x00)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
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
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
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
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
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
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
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
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
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
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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

    cpu.setMemoryValue(memoryAddress, operandB)
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

    cpu.setMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0x31)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPage addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const zeroPageOffset = 0xfa
    const instruction = [0xc6, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPage addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0x00
    const zeroPageOffset = 0xd0
    const instruction = [0xc6, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0xff)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for ZeroPageX addressing mode', () => {
    const operand = 0x74
    const xIndex = 0x30
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
    const xIndex = 0x10
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

    cpu.setMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0x7e)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for Absolute addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const memoryAddress = 0x1235
    const instruction = [0xce, memoryAddress]

    cpu.setMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for Absolute addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xa9
    const memoryAddress = 0x734c
    const instruction = [0xce, memoryAddress]

    cpu.setMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0xa8)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for AbsoluteX addressing mode', () => {
    const operand = 0x42
    const xIndex = 0x42
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
    const xIndex = 0x53
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

  test('Emulate the EOR instruction for Immediate addressing mode with ZeroFlag set', () => {
    const operandA = 0x7a
    const operandB = 0x7a
    const instruction = [0x49, operandB]

    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for Immediate addressing mode with NegativeFlag set', () => {
    const operandA = 0b10001010
    const operandB = 0b01001010
    const instruction = [0x49, operandB]

    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0b11000000)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the EOR instruction for ZeroPage', () => {
    const operand = 0xc4
    const zeroPageOffset = 0x8a
    const acummulator = 0xd2
    const instruction = [0x45, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(zeroPageOffset, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x16)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for ZeroPageX', () => {
    const operand = 0x7a
    const zeroPageOffset = 0x45
    const xIndex = 0x2a
    const acummulator = 0xf0
    const instruction = [0x55, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(zeroPageOffset + xIndex, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x8a)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the EOR instruction for Absolute', () => {
    const operand = 0x9f
    const memoryAddress = 0x47fa
    const acummulator = 0xc1
    const instruction = [0x4d, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(memoryAddress, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x5e)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for AbsoluteX', () => {
    const operand = 0x91
    const memoryAddress = 0x3030
    const xIndex = 0x10
    const acummulator = 0x91
    const instruction = [0x5d, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValue(memoryAddress + xIndex, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for AbsoluteY', () => {
    const operand = 0x12
    const memoryAddress = 0x12fa
    const yIndex = 0xcc
    const acummulator = 0xda
    const instruction = [0x59, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValue(memoryAddress + yIndex, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xc8)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the EOR instruction for IndexedIndirect', () => {
    const operand = 0xa0
    const xIndex = 0x3f
    const zeroPageOffset = 0x10
    const memoryAddress = 0x1cd0
    const acummulator = 0x0a
    const instruction = [0x41, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(memoryAddress, operand)
    cpu.setMemoryValue(zeroPageOffset + xIndex, memoryAddress, CPU_DATA_SIZE.Word)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xaa)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the EOR instruction for IndirectIndexed', () => {
    const operand = 0xcc
    const yIndex = 0x7f
    const zeroPageOffset = 0xda
    const memoryAddress = 0x2a04
    const acummulator = 0xd0
    const instruction = [0x51, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(memoryAddress + yIndex, operand)
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x1c)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for ZeroPage addressing mode', () => {
    const operand = 0x62
    const zeroPageOffset = 0x60
    const instruction = [0xe6, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0x63)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for ZeroPage addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0xff
    const zeroPageOffset = 0xd0
    const instruction = [0xe6, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for ZeroPage addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xfa
    const zeroPageOffset = 0x39
    const instruction = [0xe6, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0xfb)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for ZeroPageX addressing mode', () => {
    const operand = 0x8a
    const xIndex = 0x24
    const zeroPageOffset = 0xa0
    const instruction = [0xf6, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operand, zeroPageOffset)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset + xIndex)).toBe(0x8b)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for ZeroPageX addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0xff
    const xIndex = 0x1a
    const zeroPageOffset = 0x7a
    const instruction = [0xf6, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operand, zeroPageOffset)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset + xIndex)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for ZeroPageX addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xd0
    const xIndex = 0x20
    const zeroPageOffset = 0x20
    const instruction = [0xf6, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, operand, zeroPageOffset)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset + xIndex)).toBe(0xd1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for Absolute addressing mode', () => {
    const operand = 0x8f
    const memoryAddress = 0x482c
    const instruction = [0xee, memoryAddress]

    cpu.setMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0x90)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for Absolute addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0xff
    const memoryAddress = 0xff00
    const instruction = [0xee, memoryAddress]

    cpu.setMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for Absolute addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xd0
    const memoryAddress = 0xbbaa
    const instruction = [0xee, memoryAddress]

    cpu.setMemoryValue(memoryAddress, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0xd1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for AbsoluteX addressing mode', () => {
    const operand = 0x3a
    const xIndex = 0x5a
    const memoryAddress = 0x7423
    const instruction = [0xfe, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operand, memoryAddress)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress + xIndex)).toBe(0x3b)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for AbsoluteX addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0xff
    const xIndex = 0x12
    const memoryAddress = 0xcc12
    const instruction = [0xfe, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operand, memoryAddress)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress + xIndex)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for AbsoluteX addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xa8
    const xIndex = 0x32
    const memoryAddress = 0xda01
    const instruction = [0xfe, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, operand, memoryAddress)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress + xIndex)).toBe(0xa9)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INX instruction for Implied addressing mode', () => {
    const operand = 0xe7
    const instruction = [0xe8]

    cpu.setRegister(CPU_REGISTERS.X, operand)
    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(0xe8)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INY instruction for Implied addressing mode', () => {
    const operand = 0x0ff
    const instruction = [0xc8]

    cpu.setRegister(CPU_REGISTERS.Y, operand)
    cpu.execute(instruction)

    expect(cpu.REG.Y).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the JMP instruction for Absolute addressing mode', () => {
    const memoryAddress = 0x2030
    const instruction = [0x4c, memoryAddress]

    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x2030)
  })

  test('Emulate the JMP instruction for Indirect addressing mode', () => {
    const memoryAddress = 0x1230
    const vector = 0x3212
    const instruction = [0x6c, memoryAddress]

    cpu.setMemoryValue(memoryAddress, vector, CPU_DATA_SIZE.Word)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(vector)
  })

  test('Emulate the JMP instruction for Indirect addressing mode and its bug present when accessing by the indirect way', () => {
    // See more about this 6502 bug: https://www.nesdev.org/obelisk-6502-guide/reference.html#JMP
    const memoryAddress = 0x40ff
    const memoryAddressWithMask = memoryAddress & 0xff00
    const vector = 0xa4ca
    const anotherMemoryByte = 0x5f

    const instruction = [0x6c, memoryAddress]

    cpu.setMemoryValue(memoryAddress, vector, CPU_DATA_SIZE.Word)
    cpu.setMemoryValue(memoryAddressWithMask, anotherMemoryByte)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(0x5fca)
  })

  test('Emulate the JSR instruction for Absolute addressing mode', () => {
    const operand = 0x48af
    const stackPointer = 0xff
    const memoryStackAddress = stackPointer + 0x100
    const currentPCAddress = 0x7a10
    const instruction = [0x20, operand]

    cpu.setRegister(CPU_REGISTERS.SP, stackPointer)
    cpu.setRegister(CPU_REGISTERS.PC, currentPCAddress)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(operand)
    expect(cpu.REG.SP).toBe(stackPointer - 2)
    expect(cpu.getMemoryValue(memoryStackAddress - 1, CPU_DATA_SIZE.Word)).toBe(currentPCAddress + 2)
  })

  test('Emulate the LDA instruction for Immediate Addressing mode', () => {
    const operand = 0x9a
    const instruction = [0xa9, operand]

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x9a)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDA instruction for Immediate Addressing mode with ZeroFlag set', () => {
    const operand = 0x00
    const instruction = [0xa9, operand]

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for ZeroPage Addressing mode', () => {
    const zeroPageOffset = 0x24
    const memoryValue = 0x3f
    const instruction = [0xa5, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for ZeroPage, X Addressing mode', () => {
    const zeroPageOffset = 0x7a
    const memoryValue = 0xa9
    const xIndex = 0x22
    const instruction = [0xb5, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValue(zeroPageOffset + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDA instruction for Absolute Addressing mode', () => {
    const memoryAddress = 0xac01
    const memoryValue = 0x00
    const instruction = [0xad, memoryAddress]

    cpu.setMemoryValue(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for Absolute, X Addressing mode', () => {
    const memoryAddress = 0xcc0a
    const memoryValue = 0xf0
    const xIndex = 0x51
    const instruction = [0xbd, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValue(memoryAddress + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDA instruction for Absolute, Y Addressing mode', () => {
    const memoryAddress = 0x0015
    const memoryValue = 0x3c
    const yIndex = 0xac
    const instruction = [0xb9, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValue(memoryAddress + yIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for IndexedIndirect Addressing mode', () => {
    const zeroPageOffset = 0xb1
    const memoryAddress = 0x90af
    const memoryValue = 0x71
    const xIndex = 0x12
    const instruction = [0xa1, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValue(memoryAddress, memoryValue)
    cpu.setMemoryValue(zeroPageOffset + xIndex, memoryAddress, CPU_DATA_SIZE.Word)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for IndirectIndexed Addressing mode', () => {
    const zeroPageOffset = 0xca
    const memoryAddress = 0xff00
    const memoryValue = 0x9f
    const yIndex = 0x12
    const instruction = [0xb1, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValue(memoryAddress + yIndex, memoryValue)
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDX instruction for Immediate Addressing mode', () => {
    const operand = 0xf0
    const instruction = [0xa2, operand]

    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(0xf0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDX instruction for Immediate Addressing mode with ZeroFlag set', () => {
    const operand = 0x00
    const instruction = [0xa2, operand]

    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDX instruction for ZeroPage Addressing mode', () => {
    const zeroPageOffset = 0xb0
    const memoryValue = 0x7f
    const instruction = [0xa6, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDX instruction for ZeroPage, Y Addressing mode', () => {
    const zeroPageOffset = 0xc2
    const memoryValue = 0x14
    const yIndex = 0x12
    const instruction = [0xb6, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValue(zeroPageOffset + yIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDX instruction for Absolute Addressing mode', () => {
    const memoryAddress = 0x10f0
    const memoryValue = 0xb1
    const instruction = [0xae, memoryAddress]

    cpu.setMemoryValue(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDX instruction for Absolute, Y Addressing mode', () => {
    const memoryAddress = 0xf001
    const memoryValue = 0x00
    const yIndex = 0x6f
    const instruction = [0xbe, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValue(memoryAddress + yIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.X).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDY instruction for Immediate Addressing mode', () => {
    const operand = 0x41
    const instruction = [0xa0, operand]

    cpu.execute(instruction)

    expect(cpu.REG.Y).toBe(0x41)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDY instruction for Immediate Addressing mode with ZeroFlag set', () => {
    const operand = 0x00
    const instruction = [0xa0, operand]

    cpu.execute(instruction)

    expect(cpu.REG.Y).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDY instruction for ZeroPage Addressing mode', () => {
    const zeroPageOffset = 0x20
    const memoryValue = 0xf1
    const instruction = [0xa4, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.Y).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDY instruction for ZeroPage, X Addressing mode', () => {
    const zeroPageOffset = 0x6f
    const memoryValue = 0x3c
    const xIndex = 0x51
    const instruction = [0xb4, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValue(zeroPageOffset + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.Y).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDY instruction for Absolute Addressing mode', () => {
    const memoryAddress = 0x5500
    const memoryValue = 0xa1
    const instruction = [0xac, memoryAddress]

    cpu.setMemoryValue(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.Y).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDY instruction for Absolute, X Addressing mode', () => {
    const memoryAddress = 0xd11d
    const memoryValue = 0x00
    const xIndex = 0x4f
    const instruction = [0xbc, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValue(memoryAddress + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.Y).toBe(memoryValue)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for Accumulator Addressing mode', () => {
    const accumulatorValue = 0b10001101
    const instruction = [0x4a]

    cpu.setRegister(CPU_REGISTERS.A, accumulatorValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0b01000110)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for Accumulator Addressing mode with ZeroFlag set', () => {
    const accumulatorValue = 0b00000001
    const instruction = [0x4a]

    cpu.setRegister(CPU_REGISTERS.A, accumulatorValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0b00000000)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for ZeroPage Addressing mode', () => {
    const zeroPageOffset = 0x95
    const memoryValue = 0b10100010
    const instruction = [0x46, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset)).toBe(0b01010001)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for ZeroPage, X Addressing mode', () => {
    const zeroPageOffset = 0x21
    const memoryValue = 0b00000010
    const xIndex = 0x12
    const instruction = [0x56, zeroPageOffset]

    cpu.setMemoryValue(zeroPageOffset + xIndex, memoryValue)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(zeroPageOffset + xIndex)).toBe(0b00000001)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for Absolute Addressing mode', () => {
    const memoryAddress = 0x3100
    const memoryValue = 0b10101011
    const instruction = [0x4e, memoryAddress]

    cpu.setMemoryValue(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(0b01010101)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for Absolute, X Addressing mode', () => {
    const memoryAddress = 0x1001
    const memoryValue = 0b00000001
    const xIndex = 0xc0
    const instruction = [0x5e, memoryAddress]

    cpu.setMemoryValue(memoryAddress + xIndex, memoryValue)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress + xIndex)).toBe(0x0)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the NOP instruction for Implied Addressing mode', () => {
    const currentPC = 0x8018
    const instruction = [0xea]

    cpu.setRegister(CPU_REGISTERS.PC, currentPC)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(currentPC + 1)
  })

  test('Emulate the ORA instruction for Immediate addressing mode with ZeroFlag set', () => {
    const operandA = 0x00
    const operandB = 0x00
    const instruction = [0x09, operandB]

    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ORA instruction for Immediate addressing mode with NegativeFlag set', () => {
    const operandA = 0b10101001
    const operandB = 0b00000001
    const instruction = [0x09, operandB]

    cpu.setRegister(CPU_REGISTERS.A, operandA)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0b10101001)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for ZeroPage', () => {
    const operand = 0xd5
    const zeroPageOffset = 0x20
    const acummulator = 0x10
    const instruction = [0x05, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(zeroPageOffset, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xd5)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for ZeroPageX', () => {
    const operand = 0xb1
    const zeroPageOffset = 0x72
    const xIndex = 0x2a
    const acummulator = 0xca
    const instruction = [0x15, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(zeroPageOffset + xIndex, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xfb)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for Absolute', () => {
    const operand = 0x3f
    const memoryAddress = 0xd010
    const acummulator = 0xf1
    const instruction = [0x0d, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(memoryAddress, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xff)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for AbsoluteX', () => {
    const operand = 0x2f
    const memoryAddress = 0xa100
    const xIndex = 0x38
    const acummulator = 0xa3
    const instruction = [0x1d, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setMemoryValue(memoryAddress + xIndex, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xaf)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for AbsoluteY', () => {
    const operand = 0x01
    const memoryAddress = 0xf000
    const yIndex = 0x12
    const acummulator = 0x0f
    const instruction = [0x19, memoryAddress]

    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setMemoryValue(memoryAddress + yIndex, operand)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x0f)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ORA instruction for IndexedIndirect', () => {
    const operand = 0xb1
    const xIndex = 0xa0
    const zeroPageOffset = 0x0d
    const memoryAddress = 0xd0df
    const acummulator = 0x01
    const instruction = [0x01, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(memoryAddress, operand)
    cpu.setMemoryValue(zeroPageOffset + xIndex, memoryAddress, CPU_DATA_SIZE.Word)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xb1)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for IndirectIndexed', () => {
    const operand = 0xaa
    const yIndex = 0x28
    const zeroPageOffset = 0x71
    const memoryAddress = 0x401a
    const acummulator = 0x0a
    const instruction = [0x11, zeroPageOffset]

    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setRegister(CPU_REGISTERS.A, acummulator)
    cpu.setMemoryValue(memoryAddress + yIndex, operand)
    cpu.setMemoryValue(zeroPageOffset, memoryAddress, CPU_DATA_SIZE.Word)

    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xaa)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the PHA instruction for Implied addressing mode', () => {
    const accumulator = 0x3f
    const stackPointer = 0xff
    const memoryAddress = 0x100 + stackPointer
    const instruction = [0x48]

    cpu.setRegister(CPU_REGISTERS.SP, stackPointer)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(accumulator)
    expect(cpu.REG.SP).toBe(0xfe)
  })

  test('Emulate the PHP instruction for Implied addressing mode', () => {
    const processorStatus = 0xf1
    const stackPointer = 0xd1
    const memoryAddress = 0x100 + stackPointer
    const instruction = [0x08]

    cpu.setRegister(CPU_REGISTERS.SP, stackPointer)
    cpu.setRegister(CPU_REGISTERS.P, processorStatus)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(memoryAddress)).toBe(processorStatus)
    expect(cpu.REG.SP).toBe(0xd0)
  })

  test('Emulate the PLA instruction for Implied addressing mode with NegativeFlag set', () => {
    const stackValue = 0xa6
    const stackPointer = 0x37
    const memoryAddress = 0x100 + stackPointer
    const instruction = [0x68]

    cpu.setMemoryValue(memoryAddress, stackValue)
    cpu.setRegister(CPU_REGISTERS.SP, stackPointer)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(stackValue)
    expect(cpu.REG.SP).toBe(0x38)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the PLA instruction for Implied addressing mode with ZeroFlag set', () => {
    const previousAccumulator = 0x32
    const stackValue = 0x00
    const stackPointer = 0xfa
    const memoryAddress = 0x100 + stackPointer
    const instruction = [0x68]

    cpu.setMemoryValue(memoryAddress, stackValue)
    cpu.setRegister(CPU_REGISTERS.A, previousAccumulator)
    cpu.setRegister(CPU_REGISTERS.SP, stackPointer)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(stackValue)
    expect(cpu.REG.SP).toBe(0xfb)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the PLP instruction for Implied addressing mode', () => {
    const previousProcessorStatus = 0x11110000
    const stackValue = 0b00001111
    const stackPointer = 0xcf
    const memoryAddress = 0x100 + stackPointer
    const instruction = [0x28]

    cpu.setMemoryValue(memoryAddress, stackValue)
    cpu.setRegister(CPU_REGISTERS.P, previousProcessorStatus)
    cpu.setRegister(CPU_REGISTERS.SP, stackPointer)
    cpu.execute(instruction)

    expect(cpu.REG.P).toBe(stackValue)
    expect(cpu.REG.SP).toBe(0xd0)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0x01)
    // This flag is ignored by the NES
    expect(cpuALU.getFlag(CPU_FLAGS.DecimalModeFlag)).toBe(0x01)
  })

  test('Emulate the ROL instruction for Accumulator addressing mode and CarryFlag enabled', () => {
    const carryFlagOn = 0x01
    const operand = 0b01001101
    const instruction = [0x2a]

    cpu.setRegister(CPU_REGISTERS.P, carryFlagOn)
    cpu.setRegister(CPU_REGISTERS.A, operand)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0b10011011)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROL instruction for Accumulator addressing mode and CarryFlag disabled', () => {
    const carryFlagOff = 0x00
    const operand = 0b10001001
    const instruction = [0x2a]

    cpu.setRegister(CPU_REGISTERS.P, carryFlagOff)
    cpu.setRegister(CPU_REGISTERS.A, operand)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0b00010010)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROL instruction for ZeroPage addressing mode', () => {
    const carryFlagOn = 0x01
    const operand = 0x1a
    const memoryValue = 0b01111110
    const instruction = [0x26, operand]

    cpu.setRegister(CPU_REGISTERS.P, carryFlagOn)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPage, memoryValue, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(operand)).toBe(0b11111101)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROL instruction for ZeroPage,X addressing mode', () => {
    const carryFlagOn = 0x01
    const operand = 0x3f
    const memoryValue = 0b00011100
    const xIndex = 0x21
    const instruction = [0x36, operand]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.P, carryFlagOn)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, memoryValue, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(operand + xIndex)).toBe(0b00111001)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROL instruction for Absolute addressing mode', () => {
    const carryFlagOff = 0x00
    const operand = 0xc5a0
    const memoryValue = 0b11110000
    const instruction = [0x2e, operand]

    cpu.setRegister(CPU_REGISTERS.P, carryFlagOff)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Absolute, memoryValue, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(operand)).toBe(0b11100000)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROL instruction for Absolute,X addressing mode', () => {
    const carryFlagOff = 0x00
    const operand = 0xa003
    const memoryValue = 0b10000000
    const xIndex = 0x3f
    const instruction = [0x3e, operand]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.P, carryFlagOff)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, memoryValue, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(operand + xIndex)).toBe(0b00000000)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROR instruction for Accumulator addressing mode and CarryFlag enabled', () => {
    const carryFlag = 0x01
    const operand = 0b01110010
    const instruction = [0x6a]

    cpu.setRegister(CPU_REGISTERS.P, carryFlag)
    cpu.setRegister(CPU_REGISTERS.A, operand)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0b10111001)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROR instruction for Accumulator addressing mode and CarryFlag disabled', () => {
    const carryFlag = 0x00
    const operand = 0b10101001
    const instruction = [0x6a]

    cpu.setRegister(CPU_REGISTERS.P, carryFlag)
    cpu.setRegister(CPU_REGISTERS.A, operand)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0b01010100)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROR instruction for ZeroPage addressing mode', () => {
    const carryFlag = 0x01
    const operand = 0xc1
    const memoryValue = 0b11110000
    const instruction = [0x66, operand]

    cpu.setRegister(CPU_REGISTERS.P, carryFlag)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPage, memoryValue, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(operand)).toBe(0b11111000)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROR instruction for ZeroPage,X addressing mode', () => {
    const carryFlag = 0x01
    const operand = 0x2c
    const memoryValue = 0b01011010
    const xIndex = 0xa1
    const instruction = [0x76, operand]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.P, carryFlag)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.ZeroPageX, memoryValue, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(operand + xIndex)).toBe(0b10101101)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROR instruction for Absolute addressing mode', () => {
    const carryFlag = 0x00
    const operand = 0x9110
    const memoryValue = 0b00110011
    const instruction = [0x6e, operand]

    cpu.setRegister(CPU_REGISTERS.P, carryFlag)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Absolute, memoryValue, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(operand)).toBe(0b00011001)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROR instruction for Absolute,X addressing mode', () => {
    const carryFlag = 0x00
    const operand = 0xb000
    const memoryValue = 0b00000001
    const xIndex = 0x10
    const instruction = [0x7e, operand]

    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.P, carryFlag)
    cpu.setMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.AbsoluteX, memoryValue, operand)
    cpu.execute(instruction)

    expect(cpu.getMemoryValue(operand + xIndex)).toBe(0b00000000)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the RTI instruction for Implied addressing mode', () => {
    const pcInStack = 0x2a
    const processorStatusInStack = 0xff
    const currentPC = 0x8a23
    const currentProcessorStatus = 0x00
    const stackPointer = 0xfd
    const instruction = [0x40]

    cpu.setRegister(CPU_REGISTERS.PC, currentPC)
    cpu.setRegister(CPU_REGISTERS.P, currentProcessorStatus)
    cpu.setRegister(CPU_REGISTERS.SP, stackPointer)
    cpu.setMemoryValue(0x100 + stackPointer, processorStatusInStack)
    cpu.setMemoryValue(0x100 + stackPointer + 1, pcInStack, CPU_DATA_SIZE.Word)
    cpu.execute(instruction)

    expect(cpu.REG.SP).toBe(0xff)
    expect(cpu.REG.P).toBe(processorStatusInStack)
    expect(cpu.REG.PC).toBe(pcInStack)
  })

  test('Emulate the RTS instruction for Implied addressing mode', () => {
    const stackPointer = 0xf0
    const memoryStackAddress = stackPointer + 0x100
    const pcInStack = 0x8080
    const currentPCAddress = 0x99a0
    const instruction = [0x60]

    cpu.setRegister(CPU_REGISTERS.SP, stackPointer)
    cpu.setRegister(CPU_REGISTERS.PC, currentPCAddress)
    cpu.setMemoryValue(memoryStackAddress + 1, pcInStack, CPU_DATA_SIZE.Word)
    cpu.execute(instruction)

    expect(cpu.REG.PC).toBe(pcInStack + 1)
    expect(cpu.REG.SP).toBe(stackPointer + 2)
  })

  test('Emulate the SBC instruction for Immediate addressing mode', () => {
    const memoryValue = 0x28
    const accumulator = 0x6a
    const instruction = [0xe9, memoryValue]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x00)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x42)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for Immediate addressing mode with CarryFlag set', () => {
    const memoryValue = 0x41
    const accumulator = 0x70
    const instruction = [0xe9, memoryValue]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x01)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x30)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for Immediate addressing mode with OverFlow flag set', () => {
    const memoryValue = 0x79
    const accumulator = 0x29
    const instruction = [0xe9, memoryValue]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x01)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xb1)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for Immediate addressing mode with OverFlow flag clear', () => {
    const memoryValue = 0xa2
    const accumulator = 0x4a
    const instruction = [0xe9, memoryValue]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x00)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xa8)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for ZeroPage addressing mode', () => {
    const memoryValue = 0x40
    const accumulator = 0x50
    const stackAddress = 0x37
    const instruction = [0xe5, stackAddress]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x01)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.setMemoryValue(stackAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x11)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for ZeroPage, X addressing mode', () => {
    const memoryValue = 0xa1
    const accumulator = 0x32
    const stackAddress = 0xc1
    const xIndex = 0x12
    const instruction = [0xf5, stackAddress]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x00)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.setMemoryValue(stackAddress + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x91)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for Absolute addressing mode', () => {
    const memoryValue = 0xcc
    const accumulator = 0xcc
    const memoryAddress = 0x8af0
    const instruction = [0xed, memoryAddress]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x00)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.setMemoryValue(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for Absolute, X addressing mode', () => {
    const memoryValue = 0x7a
    const accumulator = 0x21
    const memoryAddress = 0xa001
    const xIndex = 0x30
    const instruction = [0xfd, memoryAddress]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x01)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.setMemoryValue(memoryAddress + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xa8)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for Absolute, Y addressing mode', () => {
    const memoryValue = 0x00
    const accumulator = 0x30
    const memoryAddress = 0x9900
    const yIndex = 0xa0
    const instruction = [0xf9, memoryAddress]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x01)
    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.setMemoryValue(memoryAddress + yIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x31)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for IndexedIndirect addressing mode', () => {
    const memoryValue = 0x31
    const accumulator = 0xff
    const addressVector = 0xa001
    const stackAddress = 0xa0
    const xIndex = 0x12
    const instruction = [0xe1, stackAddress]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x01)
    cpu.setRegister(CPU_REGISTERS.X, xIndex)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.setMemoryValue(addressVector, memoryValue)
    cpu.setMemoryValue(stackAddress + xIndex, addressVector, CPU_DATA_SIZE.Word)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0xcf)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for IndirectIndexed addressing mode', () => {
    const memoryValue = 0x20
    const accumulator = 0xa0
    const addressVector = 0x8032
    const stackAddress = 0x44
    const yIndex = 0x20
    const instruction = [0xf1, stackAddress]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, 0x00)
    cpu.setRegister(CPU_REGISTERS.Y, yIndex)
    cpu.setRegister(CPU_REGISTERS.A, accumulator)
    cpu.setMemoryValue(addressVector + yIndex, memoryValue)
    cpu.setMemoryValue(stackAddress, addressVector, CPU_DATA_SIZE.Word)
    cpu.execute(instruction)

    expect(cpu.REG.A).toBe(0x80)
    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPU_FLAGS.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SEC instruction for Implied addressing mode', () => {
    const instruction = [0x38]

    cpuALU.clearFlag(CPU_FLAGS.CarryFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
  })

  test('Emulate the SEC instruction for Implied addressing mode with previous CarryFlag set', () => {
    const instruction = [0x38]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.CarryFlag)).toBe(0x01)
  })

  test('Emulate the SED instruction for Implied addressing mode', () => {
    const instruction = [0xf8]

    cpuALU.clearFlag(CPU_FLAGS.DecimalModeFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.DecimalModeFlag)).toBe(0x01)
  })

  test('Emulate the SED instruction for Implied addressing mode with previous DecimalModeFlag set', () => {
    const instruction = [0xf8]

    cpuALU.setFlag(CPU_FLAGS.DecimalModeFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.DecimalModeFlag)).toBe(0x01)
  })

  test('Emulate the SEI instruction for Implied addressing mode', () => {
    const instruction = [0x78]

    cpuALU.clearFlag(CPU_FLAGS.InterruptDisable)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0x01)
  })

  test('Emulate the SEI instruction for Implied addressing mode with previous InterruptDisableFlag set', () => {
    const instruction = [0x78]

    cpuALU.setFlag(CPU_FLAGS.InterruptDisable)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPU_FLAGS.InterruptDisable)).toBe(0x01)
  })
})
