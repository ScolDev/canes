import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Bmi {
  #cpu = null
  addressingModes = {
    0x30: CPU_ADDRESSING_MODES.Relative
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { cpuALU } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const negativeFlag = cpuALU.getFlag(CPU_FLAGS.NegativeFlag)
    let displacement = 0x00

    if (negativeFlag) {
      displacement = cpuALU.getSignedByte(operand)
    }

    this.#cpu.nextPC(addressingMode, displacement)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `bmi${getASMByAddrMode(addressingMode, operand)}`
  }
}
