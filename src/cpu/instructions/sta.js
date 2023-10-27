import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu) => {
  const addressingModes = {
    0x85: CPU_ADDRESSING_MODES.ZeroPage,
    0x95: CPU_ADDRESSING_MODES.ZeroPageX,
    0x8d: CPU_ADDRESSING_MODES.Absolute,
    0x9d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x99: CPU_ADDRESSING_MODES.AbsoluteY,
    0x81: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x91: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const accumulator = cpu.REG.A

    cpu.setMemoryValueFromAddressingMode(addressingMode, accumulator, operand)
  }

  return {
    execute
  }
}
