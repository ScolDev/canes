import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Dec {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0xc6: CPU_ADDRESSING_MODES.ZeroPage,
    0xd6: CPU_ADDRESSING_MODES.ZeroPageX,
    0xce: CPU_ADDRESSING_MODES.Absolute,
    0xde: CPU_ADDRESSING_MODES.AbsoluteX
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const memoryValue = this.#cpu.loadByAddressingMode(addressingMode, operand)
    const resultValue = (memoryValue - 1) & 0xff

    this.#cpu.storeByAddressingMode(addressingMode, resultValue, operand)
    this.updateStatus(resultValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result) {
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `dec${getASMByAddrMode(addressingMode, operand)}`
  }
}
