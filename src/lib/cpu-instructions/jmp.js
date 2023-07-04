import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'

export default (cpu) => {
  const addressingModes = {
    0x4c: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const addressValue = cpu.getAddressFromAddressingMode(addressingMode, operand)

    cpu.REG.PC = addressValue
  }

  return {
    execute
  }
}
