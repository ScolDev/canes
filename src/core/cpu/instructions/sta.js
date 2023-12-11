import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Sta {
  #cpu = null

  addressingModes = {
    0x85: CPU_ADDRESSING_MODES.ZeroPage,
    0x95: CPU_ADDRESSING_MODES.ZeroPageX,
    0x8d: CPU_ADDRESSING_MODES.Absolute,
    0x9d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x99: CPU_ADDRESSING_MODES.AbsoluteY,
    0x81: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x91: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const accumulator = this.#cpu.getRegister(CPU_REGISTERS.A)

    this.#cpu.memory.storeByAddressingMode(addressingMode, accumulator, operand)
    this.#cpu.nextPC(addressingMode)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `sta${getASMByAddrMode(addressingMode, operand)}`
  }
}
