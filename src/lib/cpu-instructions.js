import CPU_ADDRESSING_MODES from './cpu-consts/cpu-addressing-modes'

export default (cpu) => {
  const opcodesAND = [0x29, 0x25, 0x35, 0x2d, 0x3d, 0x39, 0x21, 0x31]
  const addressingModesAND = {
    0x29: CPU_ADDRESSING_MODES.Immediate,
    0x25: CPU_ADDRESSING_MODES.ZeroPage,
    0x35: CPU_ADDRESSING_MODES.ZeroPageX,
    0x2d: CPU_ADDRESSING_MODES.Absolute,
    0x3d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x39: CPU_ADDRESSING_MODES.AbsoluteY,
    0x21: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x31: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const executeAND = (opcode, operand) => {
    const addressingMode = addressingModesAND[opcode]

    cpu.REG.A = cpu.REG.A & cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    return cpu.REG.A
  }

  const updateStatus = (result) => {
    if (result === 0x00) {
      cpu.REG.P = 0b00000010
    }

    if (cpu.getBitValue(0x07, result) === 0x01) {
      cpu.REG.P = cpu.REG.P + 0b10000000
    }
  }

  const decodeAndExecute = (instruction) => {
    const [opcode, operand] = instruction

    if (opcodesAND.includes(opcode)) {
      return executeAND(opcode, operand)
    }
  }

  const execute = (instruction) => {
    const result = decodeAndExecute(instruction)
    updateStatus(result)
  }

  return {
    execute
  }
}
