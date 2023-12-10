import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Bcs {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0xb0: CPU_ADDRESSING_MODES.Relative
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const carryFlag = this.#cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    let displacement = 0x00

    if (carryFlag) {
      displacement = this.#cpuALU.getSignedByte(operand)
    }

    this.#cpu.nextPC(addressingMode, displacement)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `bcs${getASMByAddrMode(addressingMode, operand)}`
  }
}
