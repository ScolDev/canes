import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Ldx {
  #cpu = null
  addressingModes = {
    0xa2: CPU_ADDRESSING_MODES.Immediate,
    0xa6: CPU_ADDRESSING_MODES.ZeroPage,
    0xb6: CPU_ADDRESSING_MODES.ZeroPageY,
    0xae: CPU_ADDRESSING_MODES.Absolute,
    0xbe: CPU_ADDRESSING_MODES.AbsoluteY
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const memoryValue = memory.loadByAddressingMode(addressingMode, operand)

    this.#cpu.setRegister(CPU_REGISTERS.X, memoryValue)
    this.updateStatus(this.#cpu.getRegister(CPU_REGISTERS.X))
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
    return `ldx${getASMByAddrMode(addressingMode, operand)}`
  }
}
