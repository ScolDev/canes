import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x38: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag)
    cpu.nextPC(addressingMode)
  }

  return {
    execute
  }
}
