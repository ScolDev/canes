import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu) => {
  const addressingModes = {
    0x4c: CPU_ADDRESSING_MODES.Absolute,
    0x6c: CPU_ADDRESSING_MODES.Indirect
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const addressValue = cpu.loadAddressByAddressingMode(addressingMode, operand)

    cpu.setPC(addressValue)
  }

  return {
    execute
  }
}
