import { CPU_FLAGS } from '../consts/flags'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Cpy {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0xc0: CPU_ADDRESSING_MODES.Immediate,
    0xc4: CPU_ADDRESSING_MODES.ZeroPage,
    0xcc: CPU_ADDRESSING_MODES.Absolute
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const registerValue = this.#cpu.getRegister(CPU_REGISTERS.Y)
    const memoryValue = this.#cpu.loadByAddressingMode(addressingMode, operand)

    const result = 0x100 + registerValue - memoryValue

    this.updateStatus(result, registerValue, memoryValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, operandA, operandB) {
    const carryFlag = operandA >= operandB ? 1 : 0

    this.#cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `cpy${getASMByAddrMode(addressingMode, operand)}`
  }
}
