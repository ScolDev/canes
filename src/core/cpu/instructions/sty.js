import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Sty {
  #cpu = null
  addressingModes = {
    0x84: CPU_ADDRESSING_MODES.ZeroPage,
    0x94: CPU_ADDRESSING_MODES.ZeroPageX,
    0x8c: CPU_ADDRESSING_MODES.Absolute
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)

    memory.storeByAddressingMode(addressingMode, yRegister, operand)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `sty${getASMByAddrMode(addressingMode, operand)}`
  }
}
