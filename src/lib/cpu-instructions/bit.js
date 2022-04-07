
import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_FLAGS from '../cpu-consts/cpu-flags'

export default (cpu, cpuALU, cpuInstructions) => {
  const addressingModes = {
    0x24: CPU_ADDRESSING_MODES.ZeroPage,
    0x2c: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const result = cpu.REG.A & memoryValue

    updateStatus(result, memoryValue)
  }

  const updateStatus = (result, operand) => {
    const zeroFlag = result ? 0 : 1
    const overflowFlag = cpuALU.getBitValue(6, operand)
    const negativeFlag = cpuALU.getBitValue(7, operand)

    cpuALU.setFlag(CPU_FLAGS.ZeroFlag, zeroFlag)
    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, overflowFlag)
    cpuALU.setFlag(CPU_FLAGS.NegativeFlag, negativeFlag)
  }

  return {
    execute
  }
}
