import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu) => {
  const addressingModes = {
    0xea: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]
    cpu.nextPC(addressingMode)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `nop${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
