import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Rts {
  #cpu = null

  addressingModes = {
    0x60: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute () {
    const newStackPointer = this.#cpu.getRegister(CPU_REGISTERS.SP) + 2
    const stackMemoryAddress = this.#cpu.getRegister(CPU_REGISTERS.SP) + 0x100
    const loadedPC = this.#cpu.loadWord(stackMemoryAddress + 1)
    const newPC = loadedPC + 1

    this.#cpu.setRegister(CPU_REGISTERS.SP, newStackPointer)
    this.#cpu.setPC(newPC)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `rts${getASMByAddrMode(addressingMode, operand)}`
  }
}
