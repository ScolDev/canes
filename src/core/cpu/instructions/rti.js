import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Rti {
  #cpu = null
  addressingModes = {
    0x40: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute () {
    const { memory } = this.#cpu.getComponents()
    const currentSP = this.#cpu.getRegister(CPU_REGISTERS.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const processorStatus = memory.load(stackMemoryAddress)
    const pc = memory.loadWord(stackMemoryAddress + 1)

    this.#cpu.setRegister(CPU_REGISTERS.P, processorStatus)
    this.#cpu.setRegister(CPU_REGISTERS.SP, currentSP + 2)
    this.#cpu.setPC(pc)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `rti${getASMByAddrMode(addressingMode, operand)}`
  }
}
