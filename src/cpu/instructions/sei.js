import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x78: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]

    cpuALU.setFlag(CPU_FLAGS.InterruptDisable)
    cpu.nextPC(addressingMode)
  }

  return {
    execute
  }
}
