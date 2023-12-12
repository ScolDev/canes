import { CPU_FLAGS } from '../consts/flags'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Cmp {
  #cpu = null
  addressingModes = {
    0xc9: CPU_ADDRESSING_MODES.Immediate,
    0xc5: CPU_ADDRESSING_MODES.ZeroPage,
    0xd5: CPU_ADDRESSING_MODES.ZeroPageX,
    0xcd: CPU_ADDRESSING_MODES.Absolute,
    0xdd: CPU_ADDRESSING_MODES.AbsoluteX,
    0xd9: CPU_ADDRESSING_MODES.AbsoluteY,
    0xc1: CPU_ADDRESSING_MODES.IndexedIndirect,
    0xd1: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const accumulator = this.#cpu.getRegister(CPU_REGISTERS.A)
    const memoryValue = memory.loadByAddressingMode(addressingMode, operand)

    const result = 0x100 + accumulator - memoryValue

    this.updateStatus(result, accumulator, memoryValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operandA, operandB) {
    const { cpuALU } = this.#cpu.getComponents()
    const carryFlag = operandA >= operandB ? 1 : 0

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `cmp${getASMByAddrMode(addressingMode, operand)}`
  }
}
