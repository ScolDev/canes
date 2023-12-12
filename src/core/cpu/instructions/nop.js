import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Nop {
  #cpu = null
  addressingModes = {
    0xea: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `nop${getASMByAddrMode(addressingMode, operand)}`
  }
}
