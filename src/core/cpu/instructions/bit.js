import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'

export class Bit {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x24: CPU_ADDRESSING_MODES.ZeroPage,
    0x2c: CPU_ADDRESSING_MODES.Absolute
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const memoryValue = this.#cpu.memory.loadByAddressingMode(addressingMode, operand)
    const result = this.#cpu.getRegister(CPU_REGISTERS.A) & memoryValue

    this.updateStatus(result, memoryValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operand) {
    const overflowFlag = this.#cpuALU.getBitValue(6, operand)

    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.setFlag(CPU_FLAGS.OverflowFlag, overflowFlag)
    this.#cpuALU.updateNegativeFlag(operand)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `bit${getASMByAddrMode(addressingMode, operand)}`
  }
}
