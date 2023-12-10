import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Txs {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x9a: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const currentXRegister = this.#cpu.getRegister(CPU_REGISTERS.X)

    this.#cpu.setRegister(CPU_REGISTERS.SP, currentXRegister)
    this.updateStatus(this.#cpu.getRegister(CPU_REGISTERS.SP))
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result) {
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `txs${getASMByAddrMode(addressingMode, operand)}`
  }
}
