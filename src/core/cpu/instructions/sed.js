import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Sed {
  #cpu = null
  addressingModes = {
    0xf8: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const { cpuALU } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]

    cpuALU.setFlag(CPU_FLAGS.DecimalModeFlag)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `sed${getASMByAddrMode(addressingMode, operand)}`
  }
}
