import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export class Asl {
  #cpu = null
  addressingModes = {
    0x0a: CPU_ADDRESSING_MODES.Acumulator,
    0x06: CPU_ADDRESSING_MODES.ZeroPage,
    0x16: CPU_ADDRESSING_MODES.ZeroPageX,
    0x0e: CPU_ADDRESSING_MODES.Absolute,
    0x1e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const operandValue = memory.loadByAddressingMode(addressingMode, operand)
    const result = (operandValue << 1) & 0xff

    memory.storeByAddressingMode(addressingMode, result, operand)
    this.updateStatus(result, operandValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operandValue) {
    const { cpuALU } = this.#cpu.getComponents()
    const carryFlag = cpuALU.getBitValue(7, operandValue)

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `asl${getASMByAddrMode(addressingMode, operand)}`
  }
}
