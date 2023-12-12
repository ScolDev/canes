import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Inc {
  #cpu = null
  addressingModes = {
    0xe6: CPU_ADDRESSING_MODES.ZeroPage,
    0xf6: CPU_ADDRESSING_MODES.ZeroPageX,
    0xee: CPU_ADDRESSING_MODES.Absolute,
    0xfe: CPU_ADDRESSING_MODES.AbsoluteX
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const memoryValue = memory.loadByAddressingMode(addressingMode, operand)
    const resultValue = (memoryValue + 1) & 0xff

    memory.storeByAddressingMode(addressingMode, resultValue, operand)
    this.updateStatus(resultValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result) {
    const { cpuALU } = this.#cpu.getComponents()
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `inc${getASMByAddrMode(addressingMode, operand)}`
  }
}
