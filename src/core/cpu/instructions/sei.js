import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Sei {
  #cpu = null
  addressingModes = {
    0x78: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const { cpuALU } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]

    cpuALU.setFlag(CPU_FLAGS.InterruptDisable)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `sei${getASMByAddrMode(addressingMode, operand)}`
  }
}
