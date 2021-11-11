import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'

export default (cpu, cpuALU, cpuInstructions) => {
  const opcodes = [0x69]
  const addressingModes = {
    0x69: CPU_ADDRESSING_MODES.Immediate
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    const operandB = cpu.REG.A

    const result = cpu.REG.A + cpu.getMemoryValueFromAddressingMode(addressingMode, operand) + carryFlag
    cpu.REG.A = result & 0xff

    updateStatus(result, operand, operandB)
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
