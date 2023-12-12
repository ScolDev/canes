import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Ror {
  #cpu = null
  addressingModes = {
    0x6a: CPU_ADDRESSING_MODES.Acumulator,
    0x66: CPU_ADDRESSING_MODES.ZeroPage,
    0x76: CPU_ADDRESSING_MODES.ZeroPageX,
    0x6e: CPU_ADDRESSING_MODES.Absolute,
    0x7e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { cpuALU, memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const operandValue = memory.loadByAddressingMode(addressingMode, operand)
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)

    const result = (operandValue >> 1) + (carryFlag << 7)

    memory.storeByAddressingMode(addressingMode, result, operand)
    this.updateStatus(result, operandValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operandValue) {
    const { cpuALU } = this.#cpu.getComponents()
    const carryFlag = cpuALU.getBitValue(0, operandValue)

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `ror${getASMByAddrMode(addressingMode, operand)}`
  }
}
