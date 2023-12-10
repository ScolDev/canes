import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Dey {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x88: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const registerValue = this.#cpu.getRegister(CPU_REGISTERS.Y)
    const resultValue = (registerValue - 1) & 0xff

    this.#cpu.setRegister(CPU_REGISTERS.Y, resultValue)
    this.updateStatus(resultValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result) {
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `dey${getASMByAddrMode(addressingMode, operand)}`
  }
}
