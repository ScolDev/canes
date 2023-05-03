import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x49: CPU_ADDRESSING_MODES.Immediate
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]

    const acumulatorValue = cpu.REG.A
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const resultValue = (acumulatorValue ^ memoryValue) & 0xff

    cpu.setRegister(CPU_REGISTERS.A, resultValue)
    updateStatus(resultValue)
  }

  const updateStatus = (result) => {
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
