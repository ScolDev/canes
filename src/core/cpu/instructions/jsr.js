import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Jsr {
  #cpu = null

  addressingModes = {
    0x20: CPU_ADDRESSING_MODES.Absolute
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const addressValue = this.#cpu.memory.loadAddressByAddressingMode(addressingMode, operand)
    const currentPC = this.#cpu.getRegister(CPU_REGISTERS.PC)
    const newStackPointer = this.#cpu.getRegister(CPU_REGISTERS.SP) - 2
    const stackMemoryAddress = (this.#cpu.getRegister(CPU_REGISTERS.SP) - 1) + 0x100

    this.#cpu.setRegister(CPU_REGISTERS.SP, newStackPointer)
    this.#cpu.memory.storeWord(stackMemoryAddress, currentPC + 2)
    this.#cpu.setPC(addressValue)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `jsr${getASMByAddrMode(addressingMode, operand)}`
  }
}
