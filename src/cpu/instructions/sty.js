import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const addressingModes = {
    0x84: CPU_ADDRESSING_MODES.ZeroPage,
    0x94: CPU_ADDRESSING_MODES.ZeroPageX,
    0x8c: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const yRegister = cpu.getRegister(CPU_REGISTERS.Y)

    cpu.storeByAddressingMode(addressingMode, yRegister, operand)
  }

  return {
    execute
  }
}
