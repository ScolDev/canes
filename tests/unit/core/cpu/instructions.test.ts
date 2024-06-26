import ControlBus from 'src/nes/core/control-bus/control-bus'
import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPUFlags } from 'src/nes/core/cpu/consts/flags'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { CPUMemoryMap } from 'src/nes/core/memory/consts/memory-map'
import { type NESMemoryComponent } from 'src/nes/core/memory/types'
import { type NESAluComponent } from 'src/nes/core/alu/types'
import { type NESCpuComponent } from 'src/nes/core/cpu/types'
import { type CPUInstruction } from 'src/nes/core/instructions/types'
import { UnknownInstruction } from 'src/nes/core/instructions/errors/unknown-instruction'

describe('CPU Instructions', () => {
  let cpuALU: NESAluComponent
  let memory: NESMemoryComponent
  let cpu: NESCpuComponent

  beforeEach(() => {
    const control = ControlBus.create()

    cpu = control.getComponents().cpu
    cpuALU = control.getComponents().alu
    memory = control.getComponents().memory
  })

  test('should throw an error when running an unknown opcode', () => {
    try {
      const instruction: CPUInstruction = [0xff]
      cpu.execute(instruction)

      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(UnknownInstruction)
      expect((error as UnknownInstruction).opcode).toBe(0xff)
    }
  })

  test('Emulate the AND instruction for Inmediate', () => {
    const instruction: CPUInstruction = [0x29, 0xff]
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for Inmediate with NegativeFlag set to 1', () => {
    const instruction: CPUInstruction = [0x29, 0xa9]
    cpu.setRegister(CPURegisters.A, 0x80)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x80)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('Emulate the AND instruction for ZeroPage', () => {
    const address = 0x12
    const memoryValue = 0x78
    const instruction: CPUInstruction = [0x25, address]

    cpu.setRegister(CPURegisters.A, 0x2d)
    memory.store(address, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x28)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for ZeroPage, X', () => {
    const address = 0x45
    const memoryValue = 0xab
    const instruction: CPUInstruction = [0x35, address]

    cpu.setRegister(CPURegisters.A, 0x9a)
    cpu.setRegister(CPURegisters.X, 0x10)
    memory.store(address + cpu.getRegister(CPURegisters.X), memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x8a)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('Emulate the AND instruction for ZeroPage, X for overflow.', () => {
    const address = 0xff
    const memoryValue = 0xff
    const instruction: CPUInstruction = [0x35, address]

    cpu.setRegister(CPURegisters.A, 0x00)
    cpu.setRegister(CPURegisters.X, 0x10)
    memory.store(address + cpu.getRegister(CPURegisters.X), memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for Absolute.', () => {
    const address = 0x1234
    const memoryValue = 0x18
    const instruction: CPUInstruction = [0x2d, address]

    cpu.setRegister(CPURegisters.A, 0x46)
    memory.store(address, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for Absolute, X.', () => {
    const address = 0xffff
    const memoryValue = 0x95
    const instruction: CPUInstruction = [0x3d, address]

    cpu.setRegister(CPURegisters.A, 0xd3)
    cpu.setRegister(CPURegisters.X, 0x3f)
    memory.store(
      (address + cpu.getRegister(CPURegisters.X)) & 0xffff,
      memoryValue
    )
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x91)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('Emulate the AND instruction for Absolute, Y.', () => {
    const address = 0xffff
    const memoryValue = 0x95
    const instruction: CPUInstruction = [0x39, address]

    cpu.setRegister(CPURegisters.A, 0xd3)
    cpu.setRegister(CPURegisters.Y, 0x3f)
    memory.store(
      (address + cpu.getRegister(CPURegisters.Y)) & 0xffff,
      memoryValue
    )
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x91)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('Emulate the AND instruction for IndexedIndirect.', () => {
    const address = 0x38ad
    const operand = 0x0a
    const memoryValue = 0x03
    const instruction: CPUInstruction = [0x21, operand]

    cpu.setRegister(CPURegisters.A, 0x92)
    cpu.setRegister(CPURegisters.X, 0x14)

    memory.store(address, memoryValue)
    memory.storeWord(
      (operand + cpu.getRegister(CPURegisters.X)) & 0xff,
      address
    )

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x02)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the AND instruction for IndexedIndirect.', () => {
    const address = 0x38ad
    const operand = 0x0a
    const memoryValue = 0xfa
    const instruction: CPUInstruction = [0x31, operand]

    cpu.setRegister(CPURegisters.A, 0x13)
    cpu.setRegister(CPURegisters.Y, 0x4a)

    memory.store(address + cpu.getRegister(CPURegisters.Y), memoryValue)
    memory.storeWord(operand & 0xff, address)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x12)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Immediate.', () => {
    const operandA = 0x12
    const operandB = 0x34
    const instruction: CPUInstruction = [0x69, operandB]

    cpu.setRegister(CPURegisters.P, 0x00)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x46)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Immediate with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const instruction: CPUInstruction = [0x69, operandB]

    cpu.setRegister(CPURegisters.P, 0x01)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x14)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Immediate without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x45
    const instruction: CPUInstruction = [0x69, operandB]

    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x95)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for ZeroPage.', () => {
    const operandA = 0x12
    const operandB = 0x34
    const zeroPageOffset = 0x78
    const instruction: CPUInstruction = [0x65, zeroPageOffset]

    cpu.setRegister(CPURegisters.P, 0x00)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(zeroPageOffset, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x46)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for ZeroPage with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const zeroPageOffset = 0xab
    const instruction: CPUInstruction = [0x65, zeroPageOffset]

    cpu.setRegister(CPURegisters.P, 0x01)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(zeroPageOffset, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x14)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for ZeroPage without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const zeroPageOffset = 0xff
    const instruction: CPUInstruction = [0x65, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x85)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for ZeroPage,X.', () => {
    const operandA = 0x12
    const operandB = 0x34
    const xIndex = 0x05
    const zeroPageOffset = 0x78
    const instruction: CPUInstruction = [0x75, zeroPageOffset]

    cpu.setRegister(CPURegisters.P, 0x00)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(zeroPageOffset + xIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x46)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for ZeroPage,X with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const xIndex = 0x05
    const zeroPageOffset = 0xab
    const instruction: CPUInstruction = [0x75, zeroPageOffset]

    cpu.setRegister(CPURegisters.P, 0x01)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(zeroPageOffset + xIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x14)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for ZeroPage,X without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const xIndex = 0x05
    const zeroPageOffset = 0xff
    const instruction: CPUInstruction = [0x75, zeroPageOffset]

    memory.store((zeroPageOffset + xIndex) & 0xff, operandB)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x85)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute.', () => {
    const operandA = 0x12
    const operandB = 0x56
    const address = 0x789a
    const instruction: CPUInstruction = [0x6d, address]

    cpu.setRegister(CPURegisters.P, 0x00)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(address, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x68)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Absolute with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const address = 0xabcd
    const instruction: CPUInstruction = [0x6d, address]

    cpu.setRegister(CPURegisters.P, 0x01)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(address, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x14)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const address = 0xffaa
    const instruction: CPUInstruction = [0x6d, address]

    memory.store(address, operandB)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x85)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute,X.', () => {
    const operandA = 0x12
    const operandB = 0x56
    const xIndex = 0x20
    const address = 0x7810
    const instruction: CPUInstruction = [0x7d, address]

    cpu.setRegister(CPURegisters.P, 0x00)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(address + xIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x68)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Absolute,X with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const xIndex = 0x20
    const address = 0xabcd
    const instruction: CPUInstruction = [0x7d, address]

    cpu.setRegister(CPURegisters.P, 0x01)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(address + xIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x14)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute,X without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const xIndex = 0x70
    const address = 0xffaa
    const instruction: CPUInstruction = [0x7d, address]

    memory.store(address + xIndex, operandB)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x85)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute,Y.', () => {
    const operandA = 0x12
    const operandB = 0x56
    const yIndex = 0x20
    const address = 0x7810
    const instruction: CPUInstruction = [0x79, address]

    cpu.setRegister(CPURegisters.P, 0x00)
    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(address + yIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x68)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
  })

  test('Emulate the ADC instruction for Absolute,Y with carry in, carry out and overflow.', () => {
    const operandA = 0x90
    const operandB = 0x83
    const yIndex = 0x20
    const address = 0xabcd
    const instruction: CPUInstruction = [0x79, address]

    cpu.setRegister(CPURegisters.P, 0x01)
    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    memory.store(address + yIndex, operandB)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x14)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for Absolute,Y without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const yIndex = 0x70
    const address = 0xffaa
    const instruction: CPUInstruction = [0x79, address]

    memory.store(address + yIndex, operandB)
    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x85)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for IndexedIndirect without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const xIndex = 0x10
    const address = 0xefa0
    const offsetZeroPage = 0xab
    const instruction: CPUInstruction = [0x61, offsetZeroPage]

    memory.store(address, operandB)
    memory.storeWord(offsetZeroPage + xIndex, address)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x85)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ADC instruction for IndirectIndexed without carry out but overflow.', () => {
    const operandA = 0x50
    const operandB = 0x35
    const yIndex = 0x10
    const address = 0xefa0
    const offsetZeroPage = 0xab
    const instruction: CPUInstruction = [0x71, offsetZeroPage]

    memory.store(address + yIndex, operandB)
    memory.storeWord(offsetZeroPage, address)
    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x85)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
  })

  test('Emulate the ASL instruction for Accumulator addressing mode.', () => {
    const operand = 0x12
    const instruction: CPUInstruction = [0x0a]

    cpu.setRegister(CPURegisters.A, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x24)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for Accumulator addressing mode with Carry and Zero flags set on.', () => {
    const operand = 0x80
    const instruction: CPUInstruction = [0x0a]

    cpu.setRegister(CPURegisters.A, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for Accumulator addressing mode with Negative flag set on.', () => {
    const operand = 0x5a
    const instruction: CPUInstruction = [0x0a]

    cpu.setRegister(CPURegisters.A, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xb4)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('Emulate the ASL instruction for ZeroPage addressing mode.', () => {
    const address = 0x4a
    const operandValue = 0x81
    const instruction: CPUInstruction = [0x06, address]

    memory.store(address, operandValue)
    cpu.execute(instruction)

    expect(memory.load(address)).toBe(0x02)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for ZeroPage,X addressing mode.', () => {
    const address = 0x54
    const xIndex = 0x20
    const operandValue = 0x23
    const instruction: CPUInstruction = [0x16, address]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.store(address + xIndex, operandValue)
    cpu.execute(instruction)

    expect(memory.load(address + xIndex)).toBe(0x46)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for Absolute addressing mode.', () => {
    const address = 0x348a
    const operandValue = 0x9f
    const instruction: CPUInstruction = [0x0e, address]

    memory.store(address, operandValue)
    cpu.execute(instruction)

    expect(memory.load(address)).toBe(0x3e)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the ASL instruction for Absolute,X addressing mode.', () => {
    const address = 0x92cf
    const operandValue = 0x00
    const instruction: CPUInstruction = [0x1e, address]

    memory.store(address, operandValue)
    cpu.execute(instruction)

    expect(memory.load(address)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the BCC instruction for Relative addressing mode.', () => {
    const address = 0x4e
    const pcAddress = 0x801f
    const instruction: CPUInstruction = [0x90, address]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x806f)
  })

  test('Emulate the BCC instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xa0
    const pcAddress = 0x801f
    const instruction: CPUInstruction = [0x90, address]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x7fc1)
  })

  test('Emulate the BCC instruction for Relative addressing mode with CarryFlag set.', () => {
    const address = 0xa0
    const pcAddress = 0x801f
    const instruction: CPUInstruction = [0x90, address]

    cpuALU.setFlag(CPUFlags.CarryFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x8021)
  })

  test('Emulate the BCS instruction for Relative addressing mode.', () => {
    const address = 0x72
    const pcAddress = 0x123f
    const instruction: CPUInstruction = [0xb0, address]

    cpuALU.setFlag(CPUFlags.CarryFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x12b3)
  })

  test('Emulate the BCS instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xc8
    const pcAddress = 0x34a2
    const instruction: CPUInstruction = [0xb0, address]

    cpuALU.setFlag(CPUFlags.CarryFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x346c)
  })

  test('Emulate the BCS instruction for Relative addressing mode with CarryFlag clear.', () => {
    const address = 0x23
    const pcAddress = 0x1001
    const instruction: CPUInstruction = [0xb0, address]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x1003)
  })

  test('Emulate the BEQ instruction for Relative addressing mode.', () => {
    const address = 0x24
    const pcAddress = 0x902a
    const instruction: CPUInstruction = [0xf0, address]

    cpuALU.setFlag(CPUFlags.ZeroFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x9050)
  })

  test('Emulate the BEQ instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xd2
    const pcAddress = 0x0012
    const instruction: CPUInstruction = [0xf0, address]

    cpuALU.setFlag(CPUFlags.ZeroFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0xffe6)
  })

  test('Emulate the BEQ instruction for Relative addressing mode with ZeroFlag clear.', () => {
    const address = 0xba
    const pcAddress = 0xa021
    const instruction: CPUInstruction = [0xf0, address]

    cpuALU.setFlag(CPUFlags.ZeroFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0xa023)
  })

  test('Emulate the BIT instruction for ZeroPage Addressing mode.', () => {
    const operand = 0b10010001
    const bitMask = 0b10000001
    const address = 0x47
    const instruction: CPUInstruction = [0x24, address]

    memory.store(address, operand)
    cpu.setRegister(CPURegisters.A, bitMask)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('Emulate the BIT instruction for ZeroPage Addressing mode and result zero.', () => {
    const operand = 0b00010000
    const bitMask = 0b10000001
    const address = 0x12
    const instruction: CPUInstruction = [0x24, address]

    memory.store(address, operand)
    cpu.setRegister(CPURegisters.A, bitMask)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the BIT instruction for Absolute Addressing mode.', () => {
    const operand = 0b10001011
    const bitMask = 0b00001011
    const address = 0xa712
    const instruction: CPUInstruction = [0x2c, address]

    memory.store(address, operand)
    cpu.setRegister(CPURegisters.A, bitMask)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(1)
  })

  test('Emulate the BIT instruction for Absolute Addressing mode and result zero.', () => {
    const operand = 0b01010010
    const bitMask = 0b10001001
    const address = 0x91a4
    const instruction: CPUInstruction = [0x2c, address]

    memory.store(address, operand)
    cpu.setRegister(CPURegisters.A, bitMask)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(1)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0)
  })

  test('Emulate the BMI instruction for Relative addressing mode.', () => {
    const address = 0x70
    const pcAddress = 0x7a10
    const instruction: CPUInstruction = [0x30, address]

    cpuALU.setFlag(CPUFlags.NegativeFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x7a82)
  })

  test('Emulate the BMI instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xa2
    const pcAddress = 0x39a9
    const instruction: CPUInstruction = [0x30, address]

    cpuALU.setFlag(CPUFlags.NegativeFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x394d)
  })

  test('Emulate the BMI instruction for Relative addressing mode with NegativeFlag clear.', () => {
    const address = 0x1a
    const pcAddress = 0x819a
    const instruction: CPUInstruction = [0x30, address]

    cpuALU.setFlag(CPUFlags.NegativeFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x819c)
  })

  test('Emulate the BNE instruction for Relative addressing mode.', () => {
    const address = 0x3f
    const pcAddress = 0xa001
    const instruction: CPUInstruction = [0xd0, address]

    cpuALU.setFlag(CPUFlags.ZeroFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0xa042)
  })

  test('Emulate the BNE instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xda
    const pcAddress = 0x8765
    const instruction: CPUInstruction = [0xd0, address]

    cpuALU.setFlag(CPUFlags.ZeroFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x8741)
  })

  test('Emulate the BNE instruction for Relative addressing mode with ZeroFlag set.', () => {
    const address = 0x45
    const pcAddress = 0x3471
    const instruction: CPUInstruction = [0xd0, address]

    cpuALU.setFlag(CPUFlags.ZeroFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x3473)
  })

  test('Emulate the BPL instruction for Relative addressing mode.', () => {
    const address = 0x10
    const pcAddress = 0xe020
    const instruction: CPUInstruction = [0x10, address]

    cpuALU.setFlag(CPUFlags.NegativeFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0xe032)
  })

  test('Emulate the BPL instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xaf
    const pcAddress = 0x9004
    const instruction: CPUInstruction = [0x10, address]

    cpuALU.setFlag(CPUFlags.NegativeFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x8fb5)
  })

  test('Emulate the BPL instruction for Relative addressing mode with NegativeFlag set.', () => {
    const address = 0x30
    const pcAddress = 0x9020
    const instruction: CPUInstruction = [0x10, address]

    cpuALU.setFlag(CPUFlags.NegativeFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x9022)
  })

  test('Emulate the BRK instruction.', () => {
    const pStatus = 0b10100011
    const sPointer = 0xff
    const pcAddress = 0x4023
    const irqInterruptVector = 0x2a3f
    const instruction: CPUInstruction = [0x00, 0xff]

    cpu.setRegister(CPURegisters.P, pStatus)
    cpu.setRegister(CPURegisters.SP, sPointer)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    memory.storeWord(CPUMemoryMap.IRQ_Vector, irqInterruptVector)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(0xfd)
    expect(cpu.getRegister(CPURegisters.PC)).toBe(irqInterruptVector)
    expect(cpuALU.getFlag(CPUFlags.BreakCommand)).toBe(0x1)

    expect(memory.load(0x01fd)).toBe(0b10110011)
    expect(memory.load(0x1ff)).toBe(0x25)
    expect(memory.load(0x1fe)).toBe(0x40)
  })

  test('Emulate the BVC instruction for Relative addressing mode.', () => {
    const address = 0x34
    const pcAddress = 0x629b
    const instruction: CPUInstruction = [0x50, address]

    cpuALU.setFlag(CPUFlags.OverflowFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x62d1)
  })

  test('Emulate the BVC instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xe1
    const pcAddress = 0x1035
    const instruction: CPUInstruction = [0x50, address]

    cpuALU.setFlag(CPUFlags.OverflowFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x1018)
  })

  test('Emulate the BVC instruction for Relative addressing mode with OverflowFlag set.', () => {
    const address = 0x38
    const pcAddress = 0xc010
    const instruction: CPUInstruction = [0x50, address]

    cpuALU.setFlag(CPUFlags.OverflowFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0xc012)
  })

  test('Emulate the BVS instruction for Relative addressing mode.', () => {
    const address = 0x28
    const pcAddress = 0x2432
    const instruction: CPUInstruction = [0x70, address]

    cpuALU.setFlag(CPUFlags.OverflowFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x245c)
  })

  test('Emulate the BVS instruction for Relative addressing mode with negative offset.', () => {
    const address = 0xa2
    const pcAddress = 0x329a
    const instruction: CPUInstruction = [0x70, address]

    cpuALU.setFlag(CPUFlags.OverflowFlag, 1)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x323e)
  })

  test('Emulate the BVS instruction for Relative addressing mode with OverflowFlag clear.', () => {
    const address = 0x26
    const pcAddress = 0xa001
    const instruction: CPUInstruction = [0x70, address]

    cpuALU.setFlag(CPUFlags.OverflowFlag, 0)
    cpu.setRegister(CPURegisters.PC, pcAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0xa003)
  })

  test('Emulate the CLC instruction for Implied addressing mode', () => {
    const instruction: CPUInstruction = [0x18]
    cpuALU.setFlag(CPUFlags.CarryFlag)
    cpuALU.setFlag(CPUFlags.NegativeFlag)
    cpuALU.setFlag(CPUFlags.ZeroFlag)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
  })

  test('Emulate the CLD instruction for Implied addressing mode', () => {
    const instruction: CPUInstruction = [0xd8]

    cpuALU.setFlag(CPUFlags.DecimalModeFlag)
    cpuALU.setFlag(CPUFlags.NegativeFlag)
    cpuALU.setFlag(CPUFlags.OverflowFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.DecimalModeFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x01)
  })

  test('Emulate the CLD instruction for Implied addressing mode with previous DecimalModeFlag disabled', () => {
    const instruction: CPUInstruction = [0xd8]

    cpuALU.clearFlag(CPUFlags.DecimalModeFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.DecimalModeFlag)).toBe(0x00)
  })

  test('Emulate the CLI instruction for Implied addressing mode', () => {
    const instruction: CPUInstruction = [0x58]
    cpuALU.setFlag(CPUFlags.InterruptDisable)
    cpuALU.setFlag(CPUFlags.BreakCommand)
    cpuALU.setFlag(CPUFlags.CarryFlag)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.InterruptDisable)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.BreakCommand)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
  })

  test('Emulate the CLV instruction for Implied addressing mode', () => {
    const instruction: CPUInstruction = [0xb8]
    cpuALU.setFlag(CPUFlags.OverflowFlag)
    cpuALU.setFlag(CPUFlags.ZeroFlag)
    cpuALU.setFlag(CPUFlags.CarryFlag)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for Immediate addressing mode', () => {
    const operandA = 0x92
    const operandB = 0x7a
    const instruction: CPUInstruction = [0xc9, operandB]
    cpu.setRegister(CPURegisters.A, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Immediate addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xaf
    const operandB = 0xaf
    const instruction: CPUInstruction = [0xc9, operandB]
    cpu.setRegister(CPURegisters.A, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Immediate addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0xa0
    const operandB = 0x12
    const instruction: CPUInstruction = [0xc9, operandB]
    cpu.setRegister(CPURegisters.A, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for ZeroPage addressing mode', () => {
    const operandA = 0x58
    const operandB = 0x32
    const zeroPageOffset = 0x2a
    const instruction: CPUInstruction = [0xc5, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for ZeroPage addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x89
    const operandB = 0x89
    const zeroPageOffset = 0xa9
    const instruction: CPUInstruction = [0xc5, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for ZeroPage addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x48
    const operandB = 0xc3
    const zeroPageOffset = 0x82
    const instruction: CPUInstruction = [0xc5, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for ZeroPage, X addressing mode', () => {
    const operandA = 0xb4
    const operandB = 0x91
    const xIndex = 0x12
    const zeroPageOffset = 0x3b
    const instruction: CPUInstruction = [0xd5, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for ZeroPage, X addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xa0
    const operandB = 0xa0
    const xIndex = 0xa2
    const zeroPageOffset = 0xa9
    const instruction: CPUInstruction = [0xd5, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for ZeroPage, X addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x22
    const operandB = 0x88
    const xIndex = 0x71
    const zeroPageOffset = 0xd1
    const instruction: CPUInstruction = [0xd5, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for Absolute addressing mode', () => {
    const operandA = 0xc3
    const operandB = 0x90
    const memoryAddress = 0x2212
    const instruction: CPUInstruction = [0xcd, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xb4
    const operandB = 0xb4
    const memoryAddress = 0xe101
    const instruction: CPUInstruction = [0xcd, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x17
    const operandB = 0x61
    const memoryAddress = 0xe101
    const instruction: CPUInstruction = [0xcd, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for Absolute, X addressing mode', () => {
    const operandA = 0xc8
    const operandB = 0x74
    const xIndex = 0x26
    const memoryAddress = 0x7211
    const instruction: CPUInstruction = [0xdd, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operandB,
      memoryAddress
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute, X addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xde
    const operandB = 0xde
    const xIndex = 0x71
    const memoryAddress = 0xbabe
    const instruction: CPUInstruction = [0xdd, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operandB,
      memoryAddress
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute, X addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x10
    const operandB = 0x58
    const xIndex = 0xa1
    const memoryAddress = 0xc001
    const instruction: CPUInstruction = [0xdd, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operandB,
      memoryAddress
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for Absolute, Y addressing mode', () => {
    const operandA = 0xaa
    const operandB = 0x6a
    const yIndex = 0x26
    const memoryAddress = 0x00af
    const instruction: CPUInstruction = [0xd9, memoryAddress]

    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteY,
      operandB,
      memoryAddress
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute, Y addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x09
    const operandB = 0x09
    const yIndex = 0xca
    const memoryAddress = 0x5600
    const instruction: CPUInstruction = [0xd9, memoryAddress]

    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteY,
      operandB,
      memoryAddress
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for Absolute, Y addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x3a
    const operandB = 0x4f
    const yIndex = 0xb1
    const memoryAddress = 0xa0aa
    const instruction: CPUInstruction = [0xd9, memoryAddress]

    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteY,
      operandB,
      memoryAddress
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for IndexedIndirect addressing mode', () => {
    const operandA = 0x90
    const operandB = 0x30
    const xIndex = 0x10
    const zeroPageOffset = 0x71
    const memoryAddress = 0x4010
    const instruction: CPUInstruction = [0xc1, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeWord(zeroPageOffset, memoryAddress)
    memory.storeByAddressingMode(
      CPUAddressingModes.IndexedIndirect,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for IndexedIndirect addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x11
    const operandB = 0x11
    const xIndex = 0x32
    const zeroPageOffset = 0x69
    const memoryAddress = 0x2299
    const instruction: CPUInstruction = [0xc1, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeWord(zeroPageOffset, memoryAddress)
    memory.storeByAddressingMode(
      CPUAddressingModes.IndexedIndirect,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for IndexedIndirect addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x16
    const operandB = 0x59
    const xIndex = 0x19
    const zeroPageOffset = 0xbf
    const memoryAddress = 0x3afc
    const instruction: CPUInstruction = [0xc1, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeWord(zeroPageOffset, memoryAddress)
    memory.storeByAddressingMode(
      CPUAddressingModes.IndexedIndirect,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CMP instruction for IndirectIndexed addressing mode', () => {
    const operandA = 0x7a
    const operandB = 0x49
    const yIndex = 0x12
    const zeroPageOffset = 0xac
    const memoryAddress = 0x3a9c
    const instruction: CPUInstruction = [0xd1, zeroPageOffset]

    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.storeWord(zeroPageOffset, memoryAddress)
    memory.storeByAddressingMode(
      CPUAddressingModes.IndirectIndexed,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for IndirectIndexed addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x7a
    const operandB = 0x7a
    const yIndex = 0x32
    const zeroPageOffset = 0x69
    const memoryAddress = 0x10aa
    const instruction: CPUInstruction = [0xd1, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, yIndex)
    memory.storeWord(zeroPageOffset, memoryAddress)
    memory.storeByAddressingMode(
      CPUAddressingModes.IndirectIndexed,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CMP instruction for IndirectIndexed addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x2a
    const operandB = 0x77
    const yIndex = 0x30
    const zeroPageOffset = 0xcc
    const memoryAddress = 0xff00
    const instruction: CPUInstruction = [0xd1, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, yIndex)
    memory.storeWord(zeroPageOffset, memoryAddress)
    memory.storeByAddressingMode(
      CPUAddressingModes.IndirectIndexed,
      operandB,
      zeroPageOffset
    )
    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPX instruction for Immediate addressing mode', () => {
    const operandA = 0xa4
    const operandB = 0x38
    const instruction: CPUInstruction = [0xe0, operandB]
    cpu.setRegister(CPURegisters.X, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for Immediate addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x4a
    const operandB = 0x4a
    const instruction: CPUInstruction = [0xe0, operandB]
    cpu.setRegister(CPURegisters.X, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for Immediate addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0xc1
    const operandB = 0x10
    const instruction: CPUInstruction = [0xe0, operandB]
    cpu.setRegister(CPURegisters.X, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPX instruction for ZeroPage addressing mode', () => {
    const operandA = 0x60
    const operandB = 0x19
    const zeroPageOffset = 0xa0
    const instruction: CPUInstruction = [0xe4, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for ZeroPage addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xab
    const operandB = 0xab
    const zeroPageOffset = 0x37
    const instruction: CPUInstruction = [0xe4, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for ZeroPage addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x23
    const operandB = 0x91
    const zeroPageOffset = 0xc0
    const instruction: CPUInstruction = [0xe4, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPX instruction for Absolute addressing mode', () => {
    const operandA = 0x8a
    const operandB = 0x42
    const memoryAddress = 0x48ac
    const instruction: CPUInstruction = [0xec, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for Absolute addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x55
    const operandB = 0x55
    const memoryAddress = 0xff10
    const instruction: CPUInstruction = [0xec, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPX instruction for Absolute addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x20
    const operandB = 0x7a
    const memoryAddress = 0x1010
    const instruction: CPUInstruction = [0xec, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.X, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPY instruction for Immediate addressing mode', () => {
    const operandA = 0xb2
    const operandB = 0x41
    const instruction: CPUInstruction = [0xc0, operandB]
    cpu.setRegister(CPURegisters.Y, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for Immediate addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x55
    const operandB = 0x55
    const instruction: CPUInstruction = [0xc0, operandB]
    cpu.setRegister(CPURegisters.Y, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for Immediate addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0xba
    const operandB = 0x23
    const instruction: CPUInstruction = [0xc0, operandB]
    cpu.setRegister(CPURegisters.Y, operandA)

    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPY instruction for ZeroPage addressing mode', () => {
    const operandA = 0x5a
    const operandB = 0x12
    const zeroPageOffset = 0xb0
    const instruction: CPUInstruction = [0xc4, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for ZeroPage addressing mode with Zero and Carry lag set', () => {
    const operandA = 0xcd
    const operandB = 0xcd
    const zeroPageOffset = 0x49
    const instruction: CPUInstruction = [0xc4, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for ZeroPage addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x34
    const operandB = 0xa7
    const zeroPageOffset = 0x72
    const instruction: CPUInstruction = [0xc4, zeroPageOffset]

    memory.store(zeroPageOffset, operandB)
    cpu.setRegister(CPURegisters.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the CPY instruction for Absolute addressing mode', () => {
    const operandA = 0x8f
    const operandB = 0x4a
    const memoryAddress = 0x6a9a
    const instruction: CPUInstruction = [0xcc, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for Absolute addressing mode with Zero and Carry lag set', () => {
    const operandA = 0x8a
    const operandB = 0x8a
    const memoryAddress = 0x1010
    const instruction: CPUInstruction = [0xcc, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the CPY instruction for Absolute addressing mode with Negative flag set and Carry flag clear after result', () => {
    const operandA = 0x32
    const operandB = 0x94
    const memoryAddress = 0x2394
    const instruction: CPUInstruction = [0xcc, memoryAddress]

    memory.store(memoryAddress, operandB)
    cpu.setRegister(CPURegisters.Y, operandA)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for ZeroPage addressing mode', () => {
    const operand = 0x32
    const zeroPageOffset = 0x23
    const instruction: CPUInstruction = [0xc6, zeroPageOffset]

    memory.store(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset)).toBe(0x31)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPage addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const zeroPageOffset = 0xfa
    const instruction: CPUInstruction = [0xc6, zeroPageOffset]

    memory.store(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPage addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0x00
    const zeroPageOffset = 0xd0
    const instruction: CPUInstruction = [0xc6, zeroPageOffset]

    memory.store(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset)).toBe(0xff)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for ZeroPageX addressing mode', () => {
    const operand = 0x74
    const xIndex = 0x30
    const zeroPageOffset = 0x74
    const instruction: CPUInstruction = [0xd6, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operand,
      zeroPageOffset
    )
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset + xIndex)).toBe(0x73)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPageX addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const xIndex = 0x10
    const zeroPageOffset = 0x59
    const instruction: CPUInstruction = [0xd6, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operand,
      zeroPageOffset
    )
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset + xIndex)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for ZeroPageX addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xde
    const xIndex = 0xf0
    const zeroPageOffset = 0x03
    const instruction: CPUInstruction = [0xd6, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operand,
      zeroPageOffset
    )
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset + xIndex)).toBe(0xdd)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for Absolute addressing mode', () => {
    const operand = 0x7f
    const memoryAddress = 0x573d
    const instruction: CPUInstruction = [0xce, memoryAddress]

    memory.store(memoryAddress, operand)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(0x7e)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for Absolute addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const memoryAddress = 0x1235
    const instruction: CPUInstruction = [0xce, memoryAddress]

    memory.store(memoryAddress, operand)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for Absolute addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xa9
    const memoryAddress = 0x734c
    const instruction: CPUInstruction = [0xce, memoryAddress]

    memory.store(memoryAddress, operand)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(0xa8)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEC instruction for AbsoluteX addressing mode', () => {
    const operand = 0x42
    const xIndex = 0x42
    const memoryAddress = 0x7423
    const instruction: CPUInstruction = [0xde, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operand,
      memoryAddress
    )
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(0x41)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for AbsoluteX addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0x01
    const xIndex = 0x53
    const memoryAddress = 0x72ac
    const instruction: CPUInstruction = [0xde, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operand,
      memoryAddress
    )
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the DEC instruction for AbsoluteX addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xde
    const xIndex = 0x01
    const memoryAddress = 0xff00
    const instruction: CPUInstruction = [0xde, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operand,
      memoryAddress
    )
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(0xdd)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEX instruction for Implied addressing mode', () => {
    const operand = 0xa0
    const instruction: CPUInstruction = [0xca]

    cpu.setRegister(CPURegisters.X, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(0x9f)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the DEY instruction for Implied addressing mode', () => {
    const operand = 0x01
    const instruction: CPUInstruction = [0x88]

    cpu.setRegister(CPURegisters.Y, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for Immediate addressing mode with ZeroFlag set', () => {
    const operandA = 0x7a
    const operandB = 0x7a
    const instruction: CPUInstruction = [0x49, operandB]

    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for Immediate addressing mode with NegativeFlag set', () => {
    const operandA = 0b10001010
    const operandB = 0b01001010
    const instruction: CPUInstruction = [0x49, operandB]

    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0b11000000)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the EOR instruction for ZeroPage', () => {
    const operand = 0xc4
    const zeroPageOffset = 0x8a
    const acummulator = 0xd2
    const instruction: CPUInstruction = [0x45, zeroPageOffset]

    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(zeroPageOffset, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x16)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for ZeroPageX', () => {
    const operand = 0x7a
    const zeroPageOffset = 0x45
    const xIndex = 0x2a
    const acummulator = 0xf0
    const instruction: CPUInstruction = [0x55, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(zeroPageOffset + xIndex, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x8a)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the EOR instruction for Absolute', () => {
    const operand = 0x9f
    const memoryAddress = 0x47fa
    const acummulator = 0xc1
    const instruction: CPUInstruction = [0x4d, memoryAddress]

    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(memoryAddress, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x5e)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for AbsoluteX', () => {
    const operand = 0x91
    const memoryAddress = 0x3030
    const xIndex = 0x10
    const acummulator = 0x91
    const instruction: CPUInstruction = [0x5d, memoryAddress]

    cpu.setRegister(CPURegisters.A, acummulator)
    cpu.setRegister(CPURegisters.X, xIndex)
    memory.store(memoryAddress + xIndex, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the EOR instruction for AbsoluteY', () => {
    const operand = 0x12
    const memoryAddress = 0x12fa
    const yIndex = 0xcc
    const acummulator = 0xda
    const instruction: CPUInstruction = [0x59, memoryAddress]

    cpu.setRegister(CPURegisters.A, acummulator)
    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.store(memoryAddress + yIndex, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xc8)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the EOR instruction for IndexedIndirect', () => {
    const operand = 0xa0
    const xIndex = 0x3f
    const zeroPageOffset = 0x10
    const memoryAddress = 0x1cd0
    const acummulator = 0x0a
    const instruction: CPUInstruction = [0x41, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(memoryAddress, operand)
    memory.storeWord(zeroPageOffset + xIndex, memoryAddress)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xaa)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the EOR instruction for IndirectIndexed', () => {
    const operand = 0xcc
    const yIndex = 0x7f
    const zeroPageOffset = 0xda
    const memoryAddress = 0x2a04
    const acummulator = 0xd0
    const instruction: CPUInstruction = [0x51, zeroPageOffset]

    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(memoryAddress + yIndex, operand)
    memory.storeWord(zeroPageOffset, memoryAddress)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x1c)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for ZeroPage addressing mode', () => {
    const operand = 0x62
    const zeroPageOffset = 0x60
    const instruction: CPUInstruction = [0xe6, zeroPageOffset]

    memory.store(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset)).toBe(0x63)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for ZeroPage addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0xff
    const zeroPageOffset = 0xd0
    const instruction: CPUInstruction = [0xe6, zeroPageOffset]

    memory.store(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for ZeroPage addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xfa
    const zeroPageOffset = 0x39
    const instruction: CPUInstruction = [0xe6, zeroPageOffset]

    memory.store(zeroPageOffset, operand)
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset)).toBe(0xfb)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for ZeroPageX addressing mode', () => {
    const operand = 0x8a
    const xIndex = 0x24
    const zeroPageOffset = 0xa0
    const instruction: CPUInstruction = [0xf6, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operand,
      zeroPageOffset
    )
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset + xIndex)).toBe(0x8b)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for ZeroPageX addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0xff
    const xIndex = 0x1a
    const zeroPageOffset = 0x7a
    const instruction: CPUInstruction = [0xf6, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operand,
      zeroPageOffset
    )
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset + xIndex)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for ZeroPageX addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xd0
    const xIndex = 0x20
    const zeroPageOffset = 0x20
    const instruction: CPUInstruction = [0xf6, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      operand,
      zeroPageOffset
    )
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset + xIndex)).toBe(0xd1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for Absolute addressing mode', () => {
    const operand = 0x8f
    const memoryAddress = 0x482c
    const instruction: CPUInstruction = [0xee, memoryAddress]

    memory.store(memoryAddress, operand)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(0x90)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for Absolute addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0xff
    const memoryAddress = 0xff00
    const instruction: CPUInstruction = [0xee, memoryAddress]

    memory.store(memoryAddress, operand)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for Absolute addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xd0
    const memoryAddress = 0xbbaa
    const instruction: CPUInstruction = [0xee, memoryAddress]

    memory.store(memoryAddress, operand)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(0xd1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INC instruction for AbsoluteX addressing mode', () => {
    const operand = 0x3a
    const xIndex = 0x5a
    const memoryAddress = 0x7423
    const instruction: CPUInstruction = [0xfe, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operand,
      memoryAddress
    )
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(0x3b)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for AbsoluteX addressing mode with Zero flag set and Negative flag clear', () => {
    const operand = 0xff
    const xIndex = 0x12
    const memoryAddress = 0xcc12
    const instruction: CPUInstruction = [0xfe, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operand,
      memoryAddress
    )
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the INC instruction for AbsoluteX addressing mode with Zero flag clear and Negative flag set', () => {
    const operand = 0xa8
    const xIndex = 0x32
    const memoryAddress = 0xda01
    const instruction: CPUInstruction = [0xfe, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      operand,
      memoryAddress
    )
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(0xa9)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INX instruction for Implied addressing mode', () => {
    const operand = 0xe7
    const instruction: CPUInstruction = [0xe8]

    cpu.setRegister(CPURegisters.X, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(0xe8)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the INY instruction for Implied addressing mode', () => {
    const operand = 0x0ff
    const instruction: CPUInstruction = [0xc8]

    cpu.setRegister(CPURegisters.Y, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the JMP instruction for Absolute addressing mode', () => {
    const memoryAddress = 0x2030
    const instruction: CPUInstruction = [0x4c, memoryAddress]

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x2030)
  })

  test('Emulate the JMP instruction for Indirect addressing mode', () => {
    const memoryAddress = 0x1230
    const vector = 0x3212
    const instruction: CPUInstruction = [0x6c, memoryAddress]

    memory.storeWord(memoryAddress, vector)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(vector)
  })

  test('Emulate the JMP instruction for Indirect addressing mode and its bug present when accessing by the indirect way', () => {
    // See more about this 6502 bug: https://www.nesdev.org/obelisk-6502-guide/reference.html#JMP
    const memoryAddress = 0x40ff
    const memoryAddressWithMask = memoryAddress & 0xff00
    const vector = 0xa4ca
    const anotherMemoryByte = 0x5f

    const instruction: CPUInstruction = [0x6c, memoryAddress]

    memory.storeWord(memoryAddress, vector)
    memory.store(memoryAddressWithMask, anotherMemoryByte)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(0x5fca)
  })

  test('Emulate the JSR instruction for Absolute addressing mode', () => {
    const operand = 0x48af
    const stackPointer = 0xff
    const memoryStackAddress = stackPointer + 0x100
    const currentPCAddress = 0x7a10
    const instruction: CPUInstruction = [0x20, operand]

    cpu.setRegister(CPURegisters.SP, stackPointer)
    cpu.setRegister(CPURegisters.PC, currentPCAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(operand)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(stackPointer - 2)
    expect(memory.loadWord(memoryStackAddress - 1)).toBe(currentPCAddress + 2)
  })

  test('Emulate the LDA instruction for Immediate Addressing mode', () => {
    const operand = 0x9a
    const instruction: CPUInstruction = [0xa9, operand]

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x9a)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDA instruction for Immediate Addressing mode with ZeroFlag set', () => {
    const operand = 0x00
    const instruction: CPUInstruction = [0xa9, operand]

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for ZeroPage Addressing mode', () => {
    const zeroPageOffset = 0x24
    const memoryValue = 0x3f
    const instruction: CPUInstruction = [0xa5, zeroPageOffset]

    memory.store(zeroPageOffset, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for ZeroPage, X Addressing mode', () => {
    const zeroPageOffset = 0x7a
    const memoryValue = 0xa9
    const xIndex = 0x22
    const instruction: CPUInstruction = [0xb5, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.store(zeroPageOffset + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDA instruction for Absolute Addressing mode', () => {
    const memoryAddress = 0xac01
    const memoryValue = 0x00
    const instruction: CPUInstruction = [0xad, memoryAddress]

    memory.store(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for Absolute, X Addressing mode', () => {
    const memoryAddress = 0xcc0a
    const memoryValue = 0xf0
    const xIndex = 0x51
    const instruction: CPUInstruction = [0xbd, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.store(memoryAddress + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDA instruction for Absolute, Y Addressing mode', () => {
    const memoryAddress = 0x0015
    const memoryValue = 0x3c
    const yIndex = 0xac
    const instruction: CPUInstruction = [0xb9, memoryAddress]

    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.store(memoryAddress + yIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for IndexedIndirect Addressing mode', () => {
    const zeroPageOffset = 0xb1
    const memoryAddress = 0x90af
    const memoryValue = 0x71
    const xIndex = 0x12
    const instruction: CPUInstruction = [0xa1, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.store(memoryAddress, memoryValue)
    memory.storeWord(zeroPageOffset + xIndex, memoryAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDA instruction for IndirectIndexed Addressing mode', () => {
    const zeroPageOffset = 0xca
    const memoryAddress = 0xff00
    const memoryValue = 0x9f
    const yIndex = 0x12
    const instruction: CPUInstruction = [0xb1, zeroPageOffset]

    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.store(memoryAddress + yIndex, memoryValue)
    memory.storeWord(zeroPageOffset, memoryAddress)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDX instruction for Immediate Addressing mode', () => {
    const operand = 0xf0
    const instruction: CPUInstruction = [0xa2, operand]

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(0xf0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDX instruction for Immediate Addressing mode with ZeroFlag set', () => {
    const operand = 0x00
    const instruction: CPUInstruction = [0xa2, operand]

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDX instruction for ZeroPage Addressing mode', () => {
    const zeroPageOffset = 0xb0
    const memoryValue = 0x7f
    const instruction: CPUInstruction = [0xa6, zeroPageOffset]

    memory.store(zeroPageOffset, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDX instruction for ZeroPage, Y Addressing mode', () => {
    const zeroPageOffset = 0xc2
    const memoryValue = 0x14
    const yIndex = 0x12
    const instruction: CPUInstruction = [0xb6, zeroPageOffset]

    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.store(zeroPageOffset + yIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDX instruction for Absolute Addressing mode', () => {
    const memoryAddress = 0x10f0
    const memoryValue = 0xb1
    const instruction: CPUInstruction = [0xae, memoryAddress]

    memory.store(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDX instruction for Absolute, Y Addressing mode', () => {
    const memoryAddress = 0xf001
    const memoryValue = 0x00
    const yIndex = 0x6f
    const instruction: CPUInstruction = [0xbe, memoryAddress]

    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.store(memoryAddress + yIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDY instruction for Immediate Addressing mode', () => {
    const operand = 0x41
    const instruction: CPUInstruction = [0xa0, operand]

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(0x41)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDY instruction for Immediate Addressing mode with ZeroFlag set', () => {
    const operand = 0x00
    const instruction: CPUInstruction = [0xa0, operand]

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDY instruction for ZeroPage Addressing mode', () => {
    const zeroPageOffset = 0x20
    const memoryValue = 0xf1
    const instruction: CPUInstruction = [0xa4, zeroPageOffset]

    memory.store(zeroPageOffset, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDY instruction for ZeroPage, X Addressing mode', () => {
    const zeroPageOffset = 0x6f
    const memoryValue = 0x3c
    const xIndex = 0x51
    const instruction: CPUInstruction = [0xb4, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.store(zeroPageOffset + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LDY instruction for Absolute Addressing mode', () => {
    const memoryAddress = 0x5500
    const memoryValue = 0xa1
    const instruction: CPUInstruction = [0xac, memoryAddress]

    memory.store(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the LDY instruction for Absolute, X Addressing mode', () => {
    const memoryAddress = 0xd11d
    const memoryValue = 0x00
    const xIndex = 0x4f
    const instruction: CPUInstruction = [0xbc, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    memory.store(memoryAddress + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(memoryValue)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for Accumulator Addressing mode', () => {
    const accumulatorValue = 0b10001101
    const instruction: CPUInstruction = [0x4a]

    cpu.setRegister(CPURegisters.A, accumulatorValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0b01000110)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for Accumulator Addressing mode with ZeroFlag set', () => {
    const accumulatorValue = 0b00000001
    const instruction: CPUInstruction = [0x4a]

    cpu.setRegister(CPURegisters.A, accumulatorValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0b00000000)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for ZeroPage Addressing mode', () => {
    const zeroPageOffset = 0x95
    const memoryValue = 0b10100010
    const instruction: CPUInstruction = [0x46, zeroPageOffset]

    memory.store(zeroPageOffset, memoryValue)
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset)).toBe(0b01010001)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for ZeroPage, X Addressing mode', () => {
    const zeroPageOffset = 0x21
    const memoryValue = 0b00000010
    const xIndex = 0x12
    const instruction: CPUInstruction = [0x56, zeroPageOffset]

    memory.store(zeroPageOffset + xIndex, memoryValue)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.execute(instruction)

    expect(memory.load(zeroPageOffset + xIndex)).toBe(0b00000001)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for Absolute Addressing mode', () => {
    const memoryAddress = 0x3100
    const memoryValue = 0b10101011
    const instruction: CPUInstruction = [0x4e, memoryAddress]

    memory.store(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(0b01010101)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the LSR instruction for Absolute, X Addressing mode', () => {
    const memoryAddress = 0x1001
    const memoryValue = 0b00000001
    const xIndex = 0xc0
    const instruction: CPUInstruction = [0x5e, memoryAddress]

    memory.store(memoryAddress + xIndex, memoryValue)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(0x0)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the NOP instruction for Implied Addressing mode', () => {
    const currentPC = 0x8018
    const instruction: CPUInstruction = [0xea]

    cpu.setRegister(CPURegisters.PC, currentPC)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(currentPC + 1)
  })

  test('Emulate the ORA instruction for Immediate addressing mode with ZeroFlag set', () => {
    const operandA = 0x00
    const operandB = 0x00
    const instruction: CPUInstruction = [0x09, operandB]

    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ORA instruction for Immediate addressing mode with NegativeFlag set', () => {
    const operandA = 0b10101001
    const operandB = 0b00000001
    const instruction: CPUInstruction = [0x09, operandB]

    cpu.setRegister(CPURegisters.A, operandA)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0b10101001)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for ZeroPage', () => {
    const operand = 0xd5
    const zeroPageOffset = 0x20
    const acummulator = 0x10
    const instruction: CPUInstruction = [0x05, zeroPageOffset]

    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(zeroPageOffset, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xd5)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for ZeroPageX', () => {
    const operand = 0xb1
    const zeroPageOffset = 0x72
    const xIndex = 0x2a
    const acummulator = 0xca
    const instruction: CPUInstruction = [0x15, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(zeroPageOffset + xIndex, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xfb)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for Absolute', () => {
    const operand = 0x3f
    const memoryAddress = 0xd010
    const acummulator = 0xf1
    const instruction: CPUInstruction = [0x0d, memoryAddress]

    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(memoryAddress, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xff)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for AbsoluteX', () => {
    const operand = 0x2f
    const memoryAddress = 0xa100
    const xIndex = 0x38
    const acummulator = 0xa3
    const instruction: CPUInstruction = [0x1d, memoryAddress]

    cpu.setRegister(CPURegisters.A, acummulator)
    cpu.setRegister(CPURegisters.X, xIndex)
    memory.store(memoryAddress + xIndex, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xaf)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for AbsoluteY', () => {
    const operand = 0x01
    const memoryAddress = 0xf000
    const yIndex = 0x12
    const acummulator = 0x0f
    const instruction: CPUInstruction = [0x19, memoryAddress]

    cpu.setRegister(CPURegisters.A, acummulator)
    cpu.setRegister(CPURegisters.Y, yIndex)
    memory.store(memoryAddress + yIndex, operand)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x0f)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ORA instruction for IndexedIndirect', () => {
    const operand = 0xb1
    const xIndex = 0xa0
    const zeroPageOffset = 0x0d
    const memoryAddress = 0xd0df
    const acummulator = 0x01
    const instruction: CPUInstruction = [0x01, zeroPageOffset]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(memoryAddress, operand)
    memory.storeWord(zeroPageOffset + xIndex, memoryAddress)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xb1)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ORA instruction for IndirectIndexed', () => {
    const operand = 0xaa
    const yIndex = 0x28
    const zeroPageOffset = 0x71
    const memoryAddress = 0x401a
    const acummulator = 0x0a
    const instruction: CPUInstruction = [0x11, zeroPageOffset]

    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, acummulator)
    memory.store(memoryAddress + yIndex, operand)
    memory.storeWord(zeroPageOffset, memoryAddress)

    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xaa)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the PHA instruction for Implied addressing mode', () => {
    const accumulator = 0x3f
    const stackPointer = 0xff
    const memoryAddress = 0x100 + stackPointer
    const instruction: CPUInstruction = [0x48]

    cpu.setRegister(CPURegisters.SP, stackPointer)
    cpu.setRegister(CPURegisters.A, accumulator)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(accumulator)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(0xfe)
  })

  test('Emulate the PHP instruction for Implied addressing mode', () => {
    const processorStatus = 0xf1
    const stackPointer = 0xd1
    const memoryAddress = 0x100 + stackPointer
    const instruction: CPUInstruction = [0x08]

    cpu.setRegister(CPURegisters.SP, stackPointer)
    cpu.setRegister(CPURegisters.P, processorStatus)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(processorStatus)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(0xd0)
  })

  test('Emulate the PLA instruction for Implied addressing mode with NegativeFlag set', () => {
    const stackValue = 0xa6
    const stackPointer = 0x37
    const memoryAddress = 0x100 + stackPointer
    const instruction: CPUInstruction = [0x68]

    memory.store(memoryAddress, stackValue)
    cpu.setRegister(CPURegisters.SP, stackPointer)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(stackValue)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(0x38)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the PLA instruction for Implied addressing mode with ZeroFlag set', () => {
    const previousAccumulator = 0x32
    const stackValue = 0x00
    const stackPointer = 0xfa
    const memoryAddress = 0x100 + stackPointer
    const instruction: CPUInstruction = [0x68]

    memory.store(memoryAddress, stackValue)
    cpu.setRegister(CPURegisters.A, previousAccumulator)
    cpu.setRegister(CPURegisters.SP, stackPointer)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(stackValue)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(0xfb)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the PLP instruction for Implied addressing mode', () => {
    const previousProcessorStatus = 0x11110000
    const stackValue = 0b00001111
    const stackPointer = 0xcf
    const memoryAddress = 0x100 + stackPointer
    const instruction: CPUInstruction = [0x28]

    memory.store(memoryAddress, stackValue)
    cpu.setRegister(CPURegisters.P, previousProcessorStatus)
    cpu.setRegister(CPURegisters.SP, stackPointer)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.P)).toBe(stackValue)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(0xd0)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.InterruptDisable)).toBe(0x01)
    // This flag is ignored by the NES
    expect(cpuALU.getFlag(CPUFlags.DecimalModeFlag)).toBe(0x01)
  })

  test('Emulate the ROL instruction for Accumulator addressing mode and CarryFlag enabled', () => {
    const carryFlagOn = 0x01
    const operand = 0b01001101
    const instruction: CPUInstruction = [0x2a]

    cpu.setRegister(CPURegisters.P, carryFlagOn)
    cpu.setRegister(CPURegisters.A, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0b10011011)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROL instruction for Accumulator addressing mode and CarryFlag disabled', () => {
    const carryFlagOff = 0x00
    const operand = 0b10001001
    const instruction: CPUInstruction = [0x2a]

    cpu.setRegister(CPURegisters.P, carryFlagOff)
    cpu.setRegister(CPURegisters.A, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0b00010010)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROL instruction for ZeroPage addressing mode', () => {
    const carryFlagOn = 0x01
    const operand = 0x1a
    const memoryValue = 0b01111110
    const instruction: CPUInstruction = [0x26, operand]

    cpu.setRegister(CPURegisters.P, carryFlagOn)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPage,
      memoryValue,
      operand
    )
    cpu.execute(instruction)

    expect(memory.load(operand)).toBe(0b11111101)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROL instruction for ZeroPage,X addressing mode', () => {
    const carryFlagOn = 0x01
    const operand = 0x3f
    const memoryValue = 0b00011100
    const xIndex = 0x21
    const instruction: CPUInstruction = [0x36, operand]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.P, carryFlagOn)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      memoryValue,
      operand
    )
    cpu.execute(instruction)

    expect(memory.load(operand + xIndex)).toBe(0b00111001)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROL instruction for Absolute addressing mode', () => {
    const carryFlagOff = 0x00
    const operand = 0xc5a0
    const memoryValue = 0b11110000
    const instruction: CPUInstruction = [0x2e, operand]

    cpu.setRegister(CPURegisters.P, carryFlagOff)
    memory.storeByAddressingMode(
      CPUAddressingModes.Absolute,
      memoryValue,
      operand
    )
    cpu.execute(instruction)

    expect(memory.load(operand)).toBe(0b11100000)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROL instruction for Absolute,X addressing mode', () => {
    const carryFlagOff = 0x00
    const operand = 0xa003
    const memoryValue = 0b10000000
    const xIndex = 0x3f
    const instruction: CPUInstruction = [0x3e, operand]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.P, carryFlagOff)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      memoryValue,
      operand
    )
    cpu.execute(instruction)

    expect(memory.load(operand + xIndex)).toBe(0b00000000)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROR instruction for Accumulator addressing mode and CarryFlag enabled', () => {
    const carryFlag = 0x01
    const operand = 0b01110010
    const instruction: CPUInstruction = [0x6a]

    cpu.setRegister(CPURegisters.P, carryFlag)
    cpu.setRegister(CPURegisters.A, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0b10111001)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROR instruction for Accumulator addressing mode and CarryFlag disabled', () => {
    const carryFlag = 0x00
    const operand = 0b10101001
    const instruction: CPUInstruction = [0x6a]

    cpu.setRegister(CPURegisters.P, carryFlag)
    cpu.setRegister(CPURegisters.A, operand)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0b01010100)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROR instruction for ZeroPage addressing mode', () => {
    const carryFlag = 0x01
    const operand = 0xc1
    const memoryValue = 0b11110000
    const instruction: CPUInstruction = [0x66, operand]

    cpu.setRegister(CPURegisters.P, carryFlag)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPage,
      memoryValue,
      operand
    )
    cpu.execute(instruction)

    expect(memory.load(operand)).toBe(0b11111000)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROR instruction for ZeroPage,X addressing mode', () => {
    const carryFlag = 0x01
    const operand = 0x2c
    const memoryValue = 0b01011010
    const xIndex = 0xa1
    const instruction: CPUInstruction = [0x76, operand]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.P, carryFlag)
    memory.storeByAddressingMode(
      CPUAddressingModes.ZeroPageX,
      memoryValue,
      operand
    )
    cpu.execute(instruction)

    expect(memory.load(operand + xIndex)).toBe(0b10101101)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the ROR instruction for Absolute addressing mode', () => {
    const carryFlag = 0x00
    const operand = 0x9110
    const memoryValue = 0b00110011
    const instruction: CPUInstruction = [0x6e, operand]

    cpu.setRegister(CPURegisters.P, carryFlag)
    memory.storeByAddressingMode(
      CPUAddressingModes.Absolute,
      memoryValue,
      operand
    )
    cpu.execute(instruction)

    expect(memory.load(operand)).toBe(0b00011001)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the ROR instruction for Absolute,X addressing mode', () => {
    const carryFlag = 0x00
    const operand = 0xb000
    const memoryValue = 0b00000001
    const xIndex = 0x10
    const instruction: CPUInstruction = [0x7e, operand]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.P, carryFlag)
    memory.storeByAddressingMode(
      CPUAddressingModes.AbsoluteX,
      memoryValue,
      operand
    )
    cpu.execute(instruction)

    expect(memory.load(operand + xIndex)).toBe(0b00000000)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the RTI instruction for Implied addressing mode', () => {
    const pcInStack = 0x2a32
    const processorStatusInStack = 0xff
    const currentPC = 0x8a23
    const currentProcessorStatus = 0x00
    const stackPointer = 0xfd
    const instruction: CPUInstruction = [0x40]

    cpu.setRegister(CPURegisters.PC, currentPC)
    cpu.setRegister(CPURegisters.P, currentProcessorStatus)
    cpu.setRegister(CPURegisters.SP, stackPointer)
    memory.store(0x100 + stackPointer, processorStatusInStack)
    memory.storeWord(0x100 + stackPointer + 1, pcInStack)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(0xff)
    expect(cpu.getRegister(CPURegisters.P)).toBe(processorStatusInStack)
    expect(cpu.getRegister(CPURegisters.PC)).toBe(pcInStack)
  })

  test('Emulate the RTS instruction for Implied addressing mode', () => {
    const stackPointer = 0xf0
    const memoryStackAddress = stackPointer + 0x100
    const pcInStack = 0x8080
    const currentPCAddress = 0x99a0
    const instruction: CPUInstruction = [0x60]

    cpu.setRegister(CPURegisters.SP, stackPointer)
    cpu.setRegister(CPURegisters.PC, currentPCAddress)
    memory.storeWord(memoryStackAddress + 1, pcInStack)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.PC)).toBe(pcInStack + 1)
    expect(cpu.getRegister(CPURegisters.SP)).toBe(stackPointer + 2)
  })

  test('Emulate the SBC instruction for Immediate addressing mode', () => {
    const memoryValue = 0x28
    const accumulator = 0x6a
    const instruction: CPUInstruction = [0xe9, memoryValue]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x00)
    cpu.setRegister(CPURegisters.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x42)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for Immediate addressing mode with CarryFlag set', () => {
    const memoryValue = 0x41
    const accumulator = 0x70
    const instruction: CPUInstruction = [0xe9, memoryValue]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x01)
    cpu.setRegister(CPURegisters.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x30)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for Immediate addressing mode with OverFlow flag set', () => {
    const memoryValue = 0x79
    const accumulator = 0x29
    const instruction: CPUInstruction = [0xe9, memoryValue]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x01)
    cpu.setRegister(CPURegisters.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xb1)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for Immediate addressing mode with OverFlow flag clear', () => {
    const memoryValue = 0xa2
    const accumulator = 0x4a
    const instruction: CPUInstruction = [0xe9, memoryValue]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x00)
    cpu.setRegister(CPURegisters.A, accumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xa8)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for ZeroPage addressing mode', () => {
    const memoryValue = 0x40
    const accumulator = 0x50
    const stackAddress = 0x37
    const instruction: CPUInstruction = [0xe5, stackAddress]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x01)
    cpu.setRegister(CPURegisters.A, accumulator)
    memory.store(stackAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x11)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for ZeroPage, X addressing mode', () => {
    const memoryValue = 0xa1
    const accumulator = 0x32
    const stackAddress = 0xc1
    const xIndex = 0x12
    const instruction: CPUInstruction = [0xf5, stackAddress]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x00)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, accumulator)
    memory.store(stackAddress + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x91)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for Absolute addressing mode', () => {
    const memoryValue = 0xcc
    const accumulator = 0xcc
    const memoryAddress = 0x8af0
    const instruction: CPUInstruction = [0xed, memoryAddress]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x00)
    cpu.setRegister(CPURegisters.A, accumulator)
    memory.store(memoryAddress, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for Absolute, X addressing mode', () => {
    const memoryValue = 0x7a
    const accumulator = 0x21
    const memoryAddress = 0xa001
    const xIndex = 0x30
    const instruction: CPUInstruction = [0xfd, memoryAddress]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x01)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, accumulator)
    memory.store(memoryAddress + xIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xa8)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for Absolute, Y addressing mode', () => {
    const memoryValue = 0x00
    const accumulator = 0x30
    const memoryAddress = 0x9900
    const yIndex = 0xa0
    const instruction: CPUInstruction = [0xf9, memoryAddress]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x01)
    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, accumulator)
    memory.store(memoryAddress + yIndex, memoryValue)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x31)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the SBC instruction for IndexedIndirect addressing mode', () => {
    const memoryValue = 0x31
    const accumulator = 0xff
    const addressVector = 0xa001
    const stackAddress = 0xa0
    const xIndex = 0x12
    const instruction: CPUInstruction = [0xe1, stackAddress]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x01)
    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, accumulator)
    memory.store(addressVector, memoryValue)
    memory.storeWord(stackAddress + xIndex, addressVector)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0xcf)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SBC instruction for IndirectIndexed addressing mode', () => {
    const memoryValue = 0x20
    const accumulator = 0xa0
    const addressVector = 0x8032
    const stackAddress = 0x44
    const yIndex = 0x20
    const instruction: CPUInstruction = [0xf1, stackAddress]

    cpuALU.setFlag(CPUFlags.CarryFlag, 0x00)
    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, accumulator)
    memory.store(addressVector + yIndex, memoryValue)
    memory.storeWord(stackAddress, addressVector)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.A)).toBe(0x80)
    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.OverflowFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the SEC instruction for Implied addressing mode', () => {
    const instruction: CPUInstruction = [0x38]

    cpuALU.clearFlag(CPUFlags.CarryFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
  })

  test('Emulate the SEC instruction for Implied addressing mode with previous CarryFlag set', () => {
    const instruction: CPUInstruction = [0x38]

    cpuALU.setFlag(CPUFlags.CarryFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.CarryFlag)).toBe(0x01)
  })

  test('Emulate the SED instruction for Implied addressing mode', () => {
    const instruction: CPUInstruction = [0xf8]

    cpuALU.clearFlag(CPUFlags.DecimalModeFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.DecimalModeFlag)).toBe(0x01)
  })

  test('Emulate the SED instruction for Implied addressing mode with previous DecimalModeFlag set', () => {
    const instruction: CPUInstruction = [0xf8]

    cpuALU.setFlag(CPUFlags.DecimalModeFlag)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.DecimalModeFlag)).toBe(0x01)
  })

  test('Emulate the SEI instruction for Implied addressing mode', () => {
    const instruction: CPUInstruction = [0x78]

    cpuALU.clearFlag(CPUFlags.InterruptDisable)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.InterruptDisable)).toBe(0x01)
  })

  test('Emulate the SEI instruction for Implied addressing mode with previous InterruptDisableFlag set', () => {
    const instruction: CPUInstruction = [0x78]

    cpuALU.setFlag(CPUFlags.InterruptDisable)
    cpu.execute(instruction)

    expect(cpuALU.getFlag(CPUFlags.InterruptDisable)).toBe(0x01)
  })

  test('Emulate the STA instruction for ZeroPage addressing mode', () => {
    const currentAccumulator = 0x32
    const memoryAddress = 0x71
    const instruction: CPUInstruction = [0x85, memoryAddress]

    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(currentAccumulator)
  })

  test('Emulate the STA instruction for ZeroPage,X addressing mode', () => {
    const currentAccumulator = 0xf1
    const memoryAddress = 0x4f
    const xIndex = 0x4a
    const instruction: CPUInstruction = [0x95, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(currentAccumulator)
  })

  test('Emulate the STA instruction for Absolute addressing mode', () => {
    const currentAccumulator = 0xc0
    const memoryAddress = 0xbaba
    const instruction: CPUInstruction = [0x8d, memoryAddress]

    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(currentAccumulator)
  })

  test('Emulate the STA instruction for Absolute,X addressing mode', () => {
    const currentAccumulator = 0xc5
    const memoryAddress = 0xa0cf
    const xIndex = 0x9f
    const instruction: CPUInstruction = [0x9d, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(currentAccumulator)
  })

  test('Emulate the STA instruction for Absolute,Y addressing mode', () => {
    const currentAccumulator = 0x2f
    const memoryAddress = 0xccff
    const yIndex = 0x1f
    const instruction: CPUInstruction = [0x9d, memoryAddress]

    cpu.setRegister(CPURegisters.X, yIndex)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + yIndex)).toBe(currentAccumulator)
  })

  test('Emulate the STA instruction for IndexedIndirect addressing mode', () => {
    const currentAccumulator = 0x71
    const stackPointer = 0xa1
    const memoryAddressVector = 0x32ff
    const xIndex = 0x2f
    const instruction: CPUInstruction = [0x81, stackPointer]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    memory.storeWord(stackPointer + xIndex, memoryAddressVector)
    cpu.execute(instruction)

    expect(memory.load(memoryAddressVector)).toBe(currentAccumulator)
  })

  test('Emulate the STA instruction for IndirectIndexed addressing mode', () => {
    const currentAccumulator = 0xcb
    const stackPointer = 0x97
    const memoryAddressVector = 0xc1a0
    const yIndex = 0x3a
    const instruction: CPUInstruction = [0x91, stackPointer]

    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    memory.storeWord(stackPointer, memoryAddressVector)
    cpu.execute(instruction)

    expect(memory.load(memoryAddressVector + yIndex)).toBe(currentAccumulator)
  })

  test('Emulate the STX instruction for ZeroPage addressing mode', () => {
    const currentX = 0x10
    const memoryAddress = 0xaa
    const instruction: CPUInstruction = [0x86, memoryAddress]

    cpu.setRegister(CPURegisters.X, currentX)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(currentX)
  })

  test('Emulate the STX instruction for ZeroPage,Y addressing mode', () => {
    const currentX = 0x2c
    const memoryAddress = 0x2c
    const yIndex = 0x52
    const instruction: CPUInstruction = [0x96, memoryAddress]

    cpu.setRegister(CPURegisters.Y, yIndex)
    cpu.setRegister(CPURegisters.X, currentX)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + yIndex)).toBe(currentX)
  })

  test('Emulate the STX instruction for Absolute addressing mode', () => {
    const currentX = 0xff
    const memoryAddress = 0xf00f
    const instruction: CPUInstruction = [0x8e, memoryAddress]

    cpu.setRegister(CPURegisters.X, currentX)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(currentX)
  })

  test('Emulate the STY instruction for ZeroPage addressing mode', () => {
    const currentY = 0x3c
    const memoryAddress = 0xc1
    const instruction: CPUInstruction = [0x84, memoryAddress]

    cpu.setRegister(CPURegisters.Y, currentY)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(currentY)
  })

  test('Emulate the STY instruction for ZeroPage,X addressing mode', () => {
    const currentY = 0xfc
    const memoryAddress = 0x9a
    const xIndex = 0x3c
    const instruction: CPUInstruction = [0x94, memoryAddress]

    cpu.setRegister(CPURegisters.X, xIndex)
    cpu.setRegister(CPURegisters.Y, currentY)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress + xIndex)).toBe(currentY)
  })

  test('Emulate the STY instruction for Absolute addressing mode', () => {
    const currentY = 0x77
    const memoryAddress = 0xaa00
    const instruction: CPUInstruction = [0x8c, memoryAddress]

    cpu.setRegister(CPURegisters.Y, currentY)
    cpu.execute(instruction)

    expect(memory.load(memoryAddress)).toBe(currentY)
  })

  test('Emulate the TAX instruction for Implied addressing mode', () => {
    const currentXRegister = 0xf4
    const currentAccumulator = 0x41
    const instruction: CPUInstruction = [0xaa]

    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(currentAccumulator)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentAccumulator)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TAX instruction for Implied addressing mode with ZeroFlag set', () => {
    const currentXRegister = 0xc1
    const currentAccumulator = 0x00
    const instruction: CPUInstruction = [0xaa]

    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(currentAccumulator)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentAccumulator)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TAX instruction for Implied addressing mode with NegativeFlag set', () => {
    const currentXRegister = 0x03
    const currentAccumulator = 0xac
    const instruction: CPUInstruction = [0xaa]

    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(currentAccumulator)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentAccumulator)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the TAY instruction for Implied addressing mode', () => {
    const currentYRegister = 0xc0
    const currentAccumulator = 0x5b
    const instruction: CPUInstruction = [0xa8]

    cpu.setRegister(CPURegisters.Y, currentYRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(currentAccumulator)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentAccumulator)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TAY instruction for Implied addressing mode with ZeroFlag set', () => {
    const currentYRegister = 0x42
    const currentAccumulator = 0x00
    const instruction: CPUInstruction = [0xa8]

    cpu.setRegister(CPURegisters.Y, currentYRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(currentAccumulator)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentAccumulator)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TAY instruction for Implied addressing mode with NegativeFlag set', () => {
    const currentYRegister = 0xf2
    const currentAccumulator = 0xbc
    const instruction: CPUInstruction = [0xa8]

    cpu.setRegister(CPURegisters.Y, currentYRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(currentAccumulator)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentAccumulator)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the TSX instruction for Implied addressing mode', () => {
    const currentSPRegister = 0x0a
    const currentXRegister = 0x1f
    const instruction: CPUInstruction = [0xba]

    cpu.setRegister(CPURegisters.SP, currentSPRegister)
    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(currentSPRegister)
    expect(cpu.getRegister(CPURegisters.X)).toBe(currentSPRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TSX instruction for Implied addressing mode with ZeroFlag set', () => {
    const currentSPRegister = 0x00
    const currentXRegister = 0xb1
    const instruction: CPUInstruction = [0xba]

    cpu.setRegister(CPURegisters.SP, currentSPRegister)
    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(currentSPRegister)
    expect(cpu.getRegister(CPURegisters.X)).toBe(currentSPRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TSX instruction for Implied addressing mode with NegativeFlag set', () => {
    const currentSPRegister = 0x8c
    const currentXRegister = 0x3a
    const instruction: CPUInstruction = [0xba]

    cpu.setRegister(CPURegisters.SP, currentSPRegister)
    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(currentSPRegister)
    expect(cpu.getRegister(CPURegisters.X)).toBe(currentSPRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the TXA instruction for Implied addressing mode', () => {
    const currentXRegister = 0x2f
    const currentAccumulator = 0x47
    const instruction: CPUInstruction = [0x8a]

    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(currentXRegister)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentXRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TXA instruction for Implied addressing mode with ZeroFlag set', () => {
    const currentXRegister = 0x00
    const currentAccumulator = 0x5a
    const instruction: CPUInstruction = [0x8a]

    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(currentXRegister)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentXRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TXA instruction for Implied addressing mode with NegativeFlag set', () => {
    const currentXRegister = 0xc1
    const currentAccumulator = 0x2f
    const instruction: CPUInstruction = [0x8a]

    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.X)).toBe(currentXRegister)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentXRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the TXS instruction for Implied addressing mode', () => {
    const currentSPRegister = 0x71
    const currentXRegister = 0x41
    const instruction: CPUInstruction = [0x9a]

    cpu.setRegister(CPURegisters.SP, currentSPRegister)
    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(currentXRegister)
    expect(cpu.getRegister(CPURegisters.X)).toBe(currentXRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TXS instruction for Implied addressing mode with ZeroFlag set', () => {
    const currentSPRegister = 0xe2
    const currentXRegister = 0x00
    const instruction: CPUInstruction = [0x9a]

    cpu.setRegister(CPURegisters.SP, currentSPRegister)
    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(currentXRegister)
    expect(cpu.getRegister(CPURegisters.X)).toBe(currentXRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TXS instruction for Implied addressing mode with NegativeFlag set', () => {
    const currentSPRegister = 0x2f
    const currentXRegister = 0xe2
    const instruction: CPUInstruction = [0x9a]

    cpu.setRegister(CPURegisters.SP, currentSPRegister)
    cpu.setRegister(CPURegisters.X, currentXRegister)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.SP)).toBe(currentXRegister)
    expect(cpu.getRegister(CPURegisters.X)).toBe(currentXRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })

  test('Emulate the TYA instruction for Implied addressing mode', () => {
    const currentYRegister = 0x2f
    const currentAccumulator = 0xf0
    const instruction: CPUInstruction = [0x98]

    cpu.setRegister(CPURegisters.Y, currentYRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(currentYRegister)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentYRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TYA instruction for Implied addressing mode with ZeroFlag set', () => {
    const currentYRegister = 0x00
    const currentAccumulator = 0xb2
    const instruction: CPUInstruction = [0x98]

    cpu.setRegister(CPURegisters.Y, currentYRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(currentYRegister)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentYRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x01)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x00)
  })

  test('Emulate the TYA instruction for Implied addressing mode with NegativeFlag set', () => {
    const currentYRegister = 0xff
    const currentAccumulator = 0x02
    const instruction: CPUInstruction = [0x98]

    cpu.setRegister(CPURegisters.Y, currentYRegister)
    cpu.setRegister(CPURegisters.A, currentAccumulator)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPURegisters.Y)).toBe(currentYRegister)
    expect(cpu.getRegister(CPURegisters.A)).toBe(currentYRegister)
    expect(cpuALU.getFlag(CPUFlags.ZeroFlag)).toBe(0x00)
    expect(cpuALU.getFlag(CPUFlags.NegativeFlag)).toBe(0x01)
  })
})
