import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Beq {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0xf0: CPU_ADDRESSING_MODES.Relative
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const zeroFlag = this.#cpuALU.getFlag(CPU_FLAGS.ZeroFlag)
    let displacement = 0x00

    if (zeroFlag) {
      displacement = this.#cpuALU.getSignedByte(operand)
    }

    this.#cpu.nextPC(addressingMode, displacement)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `beq${getASMByAddrMode(addressingMode, operand)}`
  }
}
