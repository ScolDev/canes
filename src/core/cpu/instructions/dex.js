import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Dex {
  #cpu = null
  addressingModes = {
    0xca: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const registerValue = this.#cpu.getRegister(CPU_REGISTERS.X)
    const resultValue = (registerValue - 1) & 0xff

    this.#cpu.setRegister(CPU_REGISTERS.X, resultValue)
    this.updateStatus(resultValue)
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
    return `dex${getASMByAddrMode(addressingMode, operand)}`
  }
}
