import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Tax {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0xaa: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const currentAccumulator = this.#cpu.getRegister(CPU_REGISTERS.A)

    this.#cpu.setRegister(CPU_REGISTERS.X, currentAccumulator)
    this.updateStatus(this.#cpu.getRegister(CPU_REGISTERS.X))
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result) {
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `tax${getASMByAddrMode(addressingMode, operand)}`
  }
}
