import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xf0: CPU_ADDRESSING_MODES.Relative
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const zeroFlag = cpuALU.getFlag(CPU_FLAGS.ZeroFlag)
    let displacement = 0x00

    if (zeroFlag) {
      displacement = cpuALU.getSignedByte(operand)
    }

    cpu.nextPC(addressingMode, displacement)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `beq${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
