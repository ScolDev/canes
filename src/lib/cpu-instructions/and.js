import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'

export default (cpu, cpuALU, cpuInstructions) => {
  const addressingModes = {
    0x29: CPU_ADDRESSING_MODES.Immediate,
    0x25: CPU_ADDRESSING_MODES.ZeroPage,
    0x35: CPU_ADDRESSING_MODES.ZeroPageX,
    0x2d: CPU_ADDRESSING_MODES.Absolute,
    0x3d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x39: CPU_ADDRESSING_MODES.AbsoluteY,
    0x21: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x31: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    cpu.REG.A = cpu.REG.A & cpu.getMemoryValueFromAddressingMode(addressingMode, operand)

    updateStatus(cpu.REG.A)
    return cpu.REG.A
  }

  const updateStatus = (result) => {
    cpuInstructions.updateZeroFlag(result)
    cpuInstructions.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
