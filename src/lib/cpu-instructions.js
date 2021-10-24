import CPU_ADDRESSING_MODES from './cpu-consts/cpu-addressing-modes'

export default (cpu) => {
  const opcodesAND = [0x29, 0x25, 0x35]
  const addressingModesAND = {
    0x29: CPU_ADDRESSING_MODES.Immediate,
    0x25: CPU_ADDRESSING_MODES.ZeroPage,
    0x35: CPU_ADDRESSING_MODES.ZeroPageX
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
