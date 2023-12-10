import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Cli {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x58: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]

    this.#cpuALU.clearFlag(CPU_FLAGS.InterruptDisable)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `cli${getASMByAddrMode(addressingMode, operand)}`
  }
}
