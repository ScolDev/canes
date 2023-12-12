import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Txa {
  #cpu = null
  addressingModes = {
    0x8a: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const currentXRegister = this.#cpu.getRegister(CPU_REGISTERS.X)

    this.#cpu.setRegister(CPU_REGISTERS.A, currentXRegister)
    this.updateStatus(this.#cpu.getRegister(CPU_REGISTERS.A))
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
    return `txa${getASMByAddrMode(addressingMode, operand)}`
  }
}
