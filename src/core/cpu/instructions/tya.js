import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Tya {
  #cpu = null
  addressingModes = {
    0x98: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const currentYRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)

    this.#cpu.setRegister(CPU_REGISTERS.A, currentYRegister)
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
    return `tya${getASMByAddrMode(addressingMode, operand)}`
  }
}
