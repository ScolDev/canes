import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x10: CPU_ADDRESSING_MODES.Relative
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const negativeFlag = cpuALU.getFlag(CPU_FLAGS.NegativeFlag)
    let displacement = 0x00

    if (!negativeFlag) {
      displacement = cpuALU.getSignedByte(operand)
    }

    cpu.nextPC(addressingMode, displacement)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `bpl${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
