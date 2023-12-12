import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Cld {
  #cpu = null
  addressingModes = {
    0xd8: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const { cpuALU } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]

    cpuALU.clearFlag(CPU_FLAGS.DecimalModeFlag)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `cld${getASMByAddrMode(addressingMode, operand)}`
  }
}
