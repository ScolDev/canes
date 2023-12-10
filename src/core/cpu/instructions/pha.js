import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Pha {
  #cpu = null

  addressingModes = {
    0x48: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const accumulator = this.#cpu.getRegister(CPU_REGISTERS.A)
    const currentSP = this.#cpu.getRegister(CPU_REGISTERS.SP)

    const stackMemoryAddress = 0x100 + currentSP

    this.#cpu.store(stackMemoryAddress, accumulator)
    this.#cpu.setRegister(CPU_REGISTERS.SP, currentSP - 1)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `pha${getASMByAddrMode(addressingMode, operand)}`
  }
}
