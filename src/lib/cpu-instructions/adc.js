import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'
import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'

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
    const operandA = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const operandB = cpu.REG.A

    const result = cpu.REG.A + operandA + carryFlag
    cpu.setRegister(CPU_REGISTERS.A, result & 0xff)

    updateStatus(result, operandA, operandB)
    return cpu.REG.A
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
