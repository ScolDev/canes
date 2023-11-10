import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

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
    const accumulator = cpu.getRegister(CPU_REGISTERS.A)

    cpu.storeByAddressingMode(addressingMode, accumulator, operand)
    cpu.nextPC(addressingMode)
  }

  return {
    execute
  }
}
