import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu) => {
  const addressingModes = {
    0x86: CPU_ADDRESSING_MODES.ZeroPage,
    0x96: CPU_ADDRESSING_MODES.ZeroPageY,
    0x8e: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const xRegister = cpu.REG.X

    cpu.setMemoryValueFromAddressingMode(addressingMode, xRegister, operand)
  }

  return {
    execute
  }
}
