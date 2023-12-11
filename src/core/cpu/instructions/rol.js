import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Rol {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x2a: CPU_ADDRESSING_MODES.Acumulator,
    0x26: CPU_ADDRESSING_MODES.ZeroPage,
    0x36: CPU_ADDRESSING_MODES.ZeroPageX,
    0x2e: CPU_ADDRESSING_MODES.Absolute,
    0x3e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const operandValue = this.#cpu.memory.loadByAddressingMode(addressingMode, operand)
    const carryFlag = this.#cpuALU.getFlag(CPU_FLAGS.CarryFlag)

    const result = ((operandValue << 1) + carryFlag) & 0xff

    this.#cpu.memory.storeByAddressingMode(addressingMode, result, operand)
    this.updateStatus(result, operandValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operandValue) {
    const carryFlag = this.#cpuALU.getBitValue(7, operandValue)

    this.#cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `rol${getASMByAddrMode(addressingMode, operand)}`
  }
}
