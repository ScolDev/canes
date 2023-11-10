import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x90: CPU_ADDRESSING_MODES.Relative
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    let displacement = 0x00

    if (!carryFlag) {
      displacement = cpuALU.getSignedByte(operand)
    }

    cpu.nextPC(addressingMode, displacement)
  }

  return {
    execute
  }
}
