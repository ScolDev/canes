import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Bcc {
  #cpu = null
  addressingModes = {
    0x90: CPU_ADDRESSING_MODES.Relative
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { cpuALU } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    let displacement = 0x00

    if (!carryFlag) {
      displacement = cpuALU.getSignedByte(operand)
    }

    this.#cpu.nextPC(addressingMode, displacement)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `bcc${getASMByAddrMode(addressingMode, operand)}`
  }
}
