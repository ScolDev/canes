import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'
import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x69: CPU_ADDRESSING_MODES.Immediate,
    0x65: CPU_ADDRESSING_MODES.ZeroPage,
    0x75: CPU_ADDRESSING_MODES.ZeroPageX,
    0x6d: CPU_ADDRESSING_MODES.Absolute,
    0x7d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x79: CPU_ADDRESSING_MODES.AbsoluteY,
    0x61: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x71: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    const operandA = cpu.loadByAddressingMode(addressingMode, operand)
    const operandB = cpu.getRegister(CPU_REGISTERS.A)

    const result = cpu.getRegister(CPU_REGISTERS.A) + operandA + carryFlag
    cpu.setRegister(CPU_REGISTERS.A, result & 0xff)

    updateStatus(result, operandA, operandB)
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (result, operandA, operandB) => {
    const carryFlag = result > 0xff ? 1 : 0

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
    cpuALU.updateOverflowFlag(result, operandA, operandB)
  }

  return {
    execute
  }
}
