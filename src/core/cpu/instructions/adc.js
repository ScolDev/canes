import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Adc {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x69: CPU_ADDRESSING_MODES.Immediate,
    0x65: CPU_ADDRESSING_MODES.ZeroPage,
    0x75: CPU_ADDRESSING_MODES.ZeroPageX,
    0x6d: CPU_ADDRESSING_MODES.Absolute,
    0x7d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x79: CPU_ADDRESSING_MODES.AbsoluteY,
    0x61: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x71: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const carryFlag = this.#cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    const operandA = this.#cpu.loadByAddressingMode(addressingMode, operand)
    const operandB = this.#cpu.getRegister(CPU_REGISTERS.A)

    const result = this.#cpu.getRegister(CPU_REGISTERS.A) + operandA + carryFlag
    this.#cpu.setRegister(CPU_REGISTERS.A, result & 0xff)

    this.updateStatus(result, operandA, operandB)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operandA, operandB) {
    const carryFlag = result > 0xff ? 1 : 0

    this.#cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
    this.#cpuALU.updateOverflowFlag(result, operandA, operandB)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `adc${getASMByAddrMode(addressingMode, operand)}`
  }
}
