import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Plp {
  #cpu = null

  addressingModes = {
    0x28: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const currentSP = this.#cpu.getRegister(CPU_REGISTERS.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = this.#cpu.memory.load(stackMemoryAddress)

    this.#cpu.setRegister(CPU_REGISTERS.P, memoryValue)
    this.#cpu.setRegister(CPU_REGISTERS.SP, currentSP + 1)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `plp${getASMByAddrMode(addressingMode, operand)}`
  }
}
