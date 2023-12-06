import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const addressingModes = {
    0x86: CPU_ADDRESSING_MODES.ZeroPage,
    0x96: CPU_ADDRESSING_MODES.ZeroPageY,
    0x8e: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const xRegister = cpu.getRegister(CPU_REGISTERS.X)

    cpu.storeByAddressingMode(addressingMode, xRegister, operand)
    cpu.nextPC(addressingMode)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `stx${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
