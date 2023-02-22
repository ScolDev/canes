import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_FLAGS from '../cpu-consts/cpu-flags'

export default (cpu, cpuALU, cpuInstructions) => {
  const addressingModes = {
    0x0a: CPU_ADDRESSING_MODES.Acumulator,
    0x06: CPU_ADDRESSING_MODES.ZeroPage,
    0x16: CPU_ADDRESSING_MODES.ZeroPageX,
    0x0e: CPU_ADDRESSING_MODES.Absolute,
    0x1e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const operandValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const result = (operandValue << 1) & 0xff

    cpu.setMemoryValueFromAddressingMode(addressingMode, result, operand)
    updateStatus(result, operandValue)
  }

  const updateStatus = (result, operandValue) => {
    const zeroFlag = result === 0 ? 1 : 0
    const carryFlag = cpuALU.getBitValue(7, operandValue)
    const negativeFlag = cpuALU.getBitValue(7, result)

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.setFlag(CPU_FLAGS.ZeroFlag, zeroFlag)
    cpuALU.setFlag(CPU_FLAGS.NegativeFlag, negativeFlag)
  }

  return {
    execute
  }
}
