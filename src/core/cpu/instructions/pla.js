import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export class Pla {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x68: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode) {
    const addressingMode = this.addressingModes[opcode]
    const currentSP = this.#cpu.getRegister(CPU_REGISTERS.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = this.#cpu.load(stackMemoryAddress)

    this.#cpu.setRegister(CPU_REGISTERS.A, memoryValue)
    this.#cpu.setRegister(CPU_REGISTERS.SP, currentSP + 1)

    this.updateStatus(memoryValue)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result) {
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `pla${getASMByAddrMode(addressingMode, operand)}`
  }
}
