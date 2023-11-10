import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xd0: CPU_ADDRESSING_MODES.Relative
  }
  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const zeroFlag = cpuALU.getFlag(CPU_FLAGS.ZeroFlag)
    let displacement = 0x00

    if (!zeroFlag) {
      displacement = cpuALU.getSignedByte(operand)
    }

    cpu.nextPC(addressingMode, displacement)
  }

  return {
    execute
  }
}
