import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'
import CPU_FLAGS from '../cpu-consts/cpu-flags'

export default (cpu, cpuALU, cpuInstructions) => {
  const addressingModes = {
    0x0a: CPU_ADDRESSING_MODES.Acumulator
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const operandValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const result = (operandValue << 1) & 0xff

    cpu.setRegister(CPU_REGISTERS.A, result)
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
