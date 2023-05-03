import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xc0: CPU_ADDRESSING_MODES.Immediate,
    0xc4: CPU_ADDRESSING_MODES.ZeroPage,
    0xcc: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const registerValue = cpu.REG.Y
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)

    const result = (registerValue + (0x100 - memoryValue)) & 0xff

    updateStatus(result, registerValue, memoryValue)
  }

  const updateStatus = (result, operandA, operandB) => {
    const carryFlag = operandA >= operandB ? 1 : 0

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
