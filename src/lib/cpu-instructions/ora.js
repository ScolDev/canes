import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x09: CPU_ADDRESSING_MODES.Immediate,
    0x05: CPU_ADDRESSING_MODES.ZeroPage,
    0x15: CPU_ADDRESSING_MODES.ZeroPageX,
    0x0d: CPU_ADDRESSING_MODES.Absolute,
    0x1d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x19: CPU_ADDRESSING_MODES.AbsoluteY,
    0x01: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x11: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]

    const acumulatorValue = cpu.REG.A
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const resultValue = (acumulatorValue | memoryValue) & 0xff

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