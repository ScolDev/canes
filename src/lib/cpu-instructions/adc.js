import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'

export default (cpu, cpuALU, cpuInstructions) => {
  const opcodes = [0x69, 0x65, 0x75, 0x6d, 0x7d, 0x79, 0x61, 0x71]
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
    const operandA = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const operandB = cpu.REG.A

    const result = cpu.REG.A + operandA + carryFlag
    cpu.REG.A = result & 0xff

    updateStatus(result, operandA, operandB)
    return cpu.REG.A
  }

  const updateStatus = (result, operandA, operandB) => {
    cpuInstructions.updateCarryFlag(result)
    cpuInstructions.updateZeroFlag(result)
    cpuInstructions.updateNegativeFlag(result)
    cpuInstructions.updateOverflowFlag(result, operandA, operandB)
  }

  return {
    opcodes,
    execute
  }
}
