import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xc9: CPU_ADDRESSING_MODES.Immediate
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const accumulator = cpu.REG.A
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)

    const result = ((0x100 - accumulator) + memoryValue) & 0xff

    updateStatus(result, accumulator, memoryValue)
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
