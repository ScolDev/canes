import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Sec {
  #cpu = null
  addressingModes = {
    0x38: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const { cpuALU } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]

    cpuALU.setFlag(CPU_FLAGS.CarryFlag)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `sec${getASMByAddrMode(addressingMode, operand)}`
  }
}
