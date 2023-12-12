import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Lsr {
  #cpu = null
  addressingModes = {
    0x4a: CPU_ADDRESSING_MODES.Acumulator,
    0x46: CPU_ADDRESSING_MODES.ZeroPage,
    0x56: CPU_ADDRESSING_MODES.ZeroPageX,
    0x4e: CPU_ADDRESSING_MODES.Absolute,
    0x5e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const operandValue = memory.loadByAddressingMode(addressingMode, operand)
    const result = (operandValue >> 1) & 0xff

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
    return `lsr${getASMByAddrMode(addressingMode, operand)}`
  }
}
