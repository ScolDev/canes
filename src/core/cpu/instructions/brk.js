import { CPU_FLAGS } from '../consts/flags'
import { CPU_MEMORY_MAP } from '../consts/memory-map'
import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x00: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode, operand) => {
    const pcl = (cpu.getRegister(CPU_REGISTERS.PC) & 0xff) + 2
    const pch = (cpu.getRegister(CPU_REGISTERS.PC) & 0xff00) >> 8
    const irqInterruptVector = cpu.loadWord(CPU_MEMORY_MAP.IRQ_Vector)
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)

    cpuALU.setFlag(CPU_FLAGS.BreakCommand)

    cpu.store(CPU_MEMORY_MAP.Stack + currentSP, pcl)
    cpu.store(CPU_MEMORY_MAP.Stack + (currentSP - 1), pch)
    cpu.store(CPU_MEMORY_MAP.Stack + (currentSP - 2), cpu.getRegister(CPU_REGISTERS.P))

    cpu.setRegister(CPU_REGISTERS.SP, currentSP - 2)
    cpu.setPC(irqInterruptVector)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `brk${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
