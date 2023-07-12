import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xa2: CPU_ADDRESSING_MODES.Immediate,
    0xa6: CPU_ADDRESSING_MODES.ZeroPage,
    0xb6: CPU_ADDRESSING_MODES.ZeroPageY,
    0xae: CPU_ADDRESSING_MODES.Absolute,
    0xbe: CPU_ADDRESSING_MODES.AbsoluteY
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)

    cpu.setRegister(CPU_REGISTERS.X, memoryValue)
    updateStatus(cpu.REG.X)
  }

  const updateStatus = (accumulator) => {
    cpuALU.updateZeroFlag(accumulator)
    cpuALU.updateNegativeFlag(accumulator)
  }

  return {
    execute
  }
}
