import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'

export class Bit {
  #cpu = null
  addressingModes = {
    0x24: CPU_ADDRESSING_MODES.ZeroPage,
    0x2c: CPU_ADDRESSING_MODES.Absolute
  }

  constructor (cpu) {
    this.#cpu = cpu
  }

  execute (opcode, operand) {
    const { memory } = this.#cpu.getComponents()
    const addressingMode = this.addressingModes[opcode]
    const memoryValue = memory.loadByAddressingMode(addressingMode, operand)
    const result = this.#cpu.getRegister(CPU_REGISTERS.A) & memoryValue

    this.updateStatus(result, memoryValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operand) {
    const { cpuALU } = this.#cpu.getComponents()
    const overflowFlag = cpuALU.getBitValue(6, operand)

    cpuALU.updateZeroFlag(result)
    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, overflowFlag)
    cpuALU.updateNegativeFlag(operand)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `bit${getASMByAddrMode(addressingMode, operand)}`
  }
}
