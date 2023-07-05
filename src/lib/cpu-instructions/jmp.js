import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu) => {
  const addressingModes = {
    0x4c: CPU_ADDRESSING_MODES.Absolute,
    0x6c: CPU_ADDRESSING_MODES.Indirect
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const addressValue = cpu.getAddressFromAddressingMode(addressingMode, operand)

    cpu.setRegister(CPU_REGISTERS.PC, addressValue)
  }

  return {
    execute
  }
}
