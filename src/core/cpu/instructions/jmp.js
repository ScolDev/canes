import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Jmp {
  #cpu = null

  addressingModes = {
    0x4c: CPU_ADDRESSING_MODES.Absolute,
    0x6c: CPU_ADDRESSING_MODES.Indirect
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const addressValue = this.#cpu.loadAddressByAddressingMode(addressingMode, operand)

    this.#cpu.setPC(addressValue)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `jmp${getASMByAddrMode(addressingMode, operand)}`
  }
}
