import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Bvs {
  #cpu = null
  addressingModes = {
    0x70: CPU_ADDRESSING_MODES.Relative
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { cpuALU } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const overflowFlag = cpuALU.getFlag(CPU_FLAGS.OverflowFlag)
    let displacement = 0x00

    if (overflowFlag) {
      displacement = cpuALU.getSignedByte(operand)
    }

    this.#cpu.nextPC(addressingMode, displacement)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `bvs${getASMByAddrMode(addressingMode, operand)}`
  }
}
