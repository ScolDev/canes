import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Ldy {
  #cpu = null
  addressingModes = {
    0xa0: CPU_ADDRESSING_MODES.Immediate,
    0xa4: CPU_ADDRESSING_MODES.ZeroPage,
    0xb4: CPU_ADDRESSING_MODES.ZeroPageX,
    0xac: CPU_ADDRESSING_MODES.Absolute,
    0xbc: CPU_ADDRESSING_MODES.AbsoluteX
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const memoryValue = memory.loadByAddressingMode(addressingMode, operand)

    this.#cpu.setRegister(CPU_REGISTERS.Y, memoryValue)
    this.updateStatus(this.#cpu.getRegister(CPU_REGISTERS.Y))
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
    return `ldy${getASMByAddrMode(addressingMode, operand)}`
  }
}
