import CPU_ADDRESSING_MODES from './cpu-consts/cpu-addressing-modes'

export default (cpu) => {
  const executeAND = (operand) => {
    cpu.REG.A = cpu.REG.A & cpu.getMemoryValueFromAddressingMode(CPU_ADDRESSING_MODES.Immediate, operand)
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

    if (opcode === 0x29) {
      return executeAND(operand)
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
