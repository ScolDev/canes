import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Ror {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x6a: CPU_ADDRESSING_MODES.Acumulator,
    0x66: CPU_ADDRESSING_MODES.ZeroPage,
    0x76: CPU_ADDRESSING_MODES.ZeroPageX,
    0x6e: CPU_ADDRESSING_MODES.Absolute,
    0x7e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const operandValue = this.#cpu.memory.loadByAddressingMode(addressingMode, operand)
    const carryFlag = this.#cpuALU.getFlag(CPU_FLAGS.CarryFlag)

    const result = (operandValue >> 1) + (carryFlag << 7)

    this.#cpu.memory.storeByAddressingMode(addressingMode, result, operand)
    this.updateStatus(result, operandValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operandValue) {
    const carryFlag = this.#cpuALU.getBitValue(0, operandValue)

    this.#cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `ror${getASMByAddrMode(addressingMode, operand)}`
  }
}
