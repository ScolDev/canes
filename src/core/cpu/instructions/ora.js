import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Ora {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x09: CPU_ADDRESSING_MODES.Immediate,
    0x05: CPU_ADDRESSING_MODES.ZeroPage,
    0x15: CPU_ADDRESSING_MODES.ZeroPageX,
    0x0d: CPU_ADDRESSING_MODES.Absolute,
    0x1d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x19: CPU_ADDRESSING_MODES.AbsoluteY,
    0x01: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x11: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]

    const acumulatorValue = this.#cpu.getRegister(CPU_REGISTERS.A)
    const memoryValue = this.#cpu.loadByAddressingMode(addressingMode, operand)
    const resultValue = (acumulatorValue | memoryValue) & 0xff

    this.#cpu.setRegister(CPU_REGISTERS.A, resultValue)
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
    return `ora${getASMByAddrMode(addressingMode, operand)}`
  }
}
