import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_FLAGS from '../cpu-consts/cpu-flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x6a: CPU_ADDRESSING_MODES.Acumulator,
    0x66: CPU_ADDRESSING_MODES.ZeroPage,
    0x76: CPU_ADDRESSING_MODES.ZeroPageX,
    0x6e: CPU_ADDRESSING_MODES.Absolute,
    0x7e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const operandValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)

    const result = ((operandValue >> 1) + (carryFlag << 7)) & 0xff

    cpu.setMemoryValueFromAddressingMode(addressingMode, result, operand)
    updateStatus(result, operandValue)
  }

  const updateStatus = (result, operandValue) => {
    const carryFlag = cpuALU.getBitValue(0, operandValue)

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
