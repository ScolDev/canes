import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Stx {
  #cpu = null

  addressingModes = {
    0x86: CPU_ADDRESSING_MODES.ZeroPage,
    0x96: CPU_ADDRESSING_MODES.ZeroPageY,
    0x8e: CPU_ADDRESSING_MODES.Absolute
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)

    this.#cpu.storeByAddressingMode(addressingMode, xRegister, operand)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `stx${getASMByAddrMode(addressingMode, operand)}`
  }
}
