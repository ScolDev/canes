import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class And {
  #cpu = null
  addressingModes = {
    0x29: CPU_ADDRESSING_MODES.Immediate,
    0x25: CPU_ADDRESSING_MODES.ZeroPage,
    0x35: CPU_ADDRESSING_MODES.ZeroPageX,
    0x2d: CPU_ADDRESSING_MODES.Absolute,
    0x3d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x39: CPU_ADDRESSING_MODES.AbsoluteY,
    0x21: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x31: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    this.#cpu.setRegister(CPU_REGISTERS.A, this.#cpu.getRegister(CPU_REGISTERS.A) & memory.loadByAddressingMode(addressingMode, operand))

    this.updateStatus(this.#cpu.getRegister(CPU_REGISTERS.A))
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
    return `and${getASMByAddrMode(addressingMode, operand)}`
  }
}
