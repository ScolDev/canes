import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xb8: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]

    cpuALU.clearFlag(CPU_FLAGS.OverflowFlag)
    cpu.nextPC(addressingMode)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `clv${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
