import { CPU_FLAGS } from '../consts/flags'
import { CPU_MEMORY_MAP } from '../consts/memory-map'
import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Brk {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0x00: CPU_ADDRESSING_MODES.Implied
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute () {
    const pcl = (this.#cpu.getRegister(CPU_REGISTERS.PC) & 0xff) + 2
    const pch = (this.#cpu.getRegister(CPU_REGISTERS.PC) & 0xff00) >> 8
    const irqInterruptVector = this.#cpu.loadWord(CPU_MEMORY_MAP.IRQ_Vector)
    const currentSP = this.#cpu.getRegister(CPU_REGISTERS.SP)

    this.#cpuALU.setFlag(CPU_FLAGS.BreakCommand)

    this.#cpu.store(CPU_MEMORY_MAP.Stack + currentSP, pcl)
    this.#cpu.store(CPU_MEMORY_MAP.Stack + (currentSP - 1), pch)
    this.#cpu.store(CPU_MEMORY_MAP.Stack + (currentSP - 2), this.#cpu.getRegister(CPU_REGISTERS.P))

    this.#cpu.setRegister(CPU_REGISTERS.SP, currentSP - 2)
    this.#cpu.setPC(irqInterruptVector)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `brk${getASMByAddrMode(addressingMode, operand)}`
  }
}
