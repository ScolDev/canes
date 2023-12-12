import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Tsx {
  #cpu = null
  addressingModes = {
    0xba: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const stackPointer = this.#cpu.getRegister(CPU_REGISTERS.SP)

    this.#cpu.setRegister(CPU_REGISTERS.X, stackPointer)
    this.updateStatus(this.#cpu.getRegister(CPU_REGISTERS.X))
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result) {
    const { cpuALU } = this.#cpu.getComponents()
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `tsx${getASMByAddrMode(addressingMode, operand)}`
  }
}
