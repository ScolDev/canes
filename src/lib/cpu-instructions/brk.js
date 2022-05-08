import CPU_DATA_SIZE from '../cpu-consts/cpu-data-size'
import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_MEMORY_MAP from '../cpu-consts/cpu-memory-map'

export default (cpu, cpuALU, cpuInstructions) => {
  const execute = (opcode, operand) => {
    const pcl = (cpu.REG.PC & 0xff) + 2
    const pch = (cpu.REG.PC & 0xff00) >> 8
    const irqInterruptVector = cpu.getMemoryValue(CPU_MEMORY_MAP.IRQ_Vector, CPU_DATA_SIZE.Word)

    cpuALU.setFlag(CPU_FLAGS.BreakCommand)

    cpu.putMemoryValue(CPU_MEMORY_MAP.Stack + cpu.REG.SP, pcl)
    cpu.putMemoryValue(CPU_MEMORY_MAP.Stack + (--cpu.REG.SP), pch)
    cpu.putMemoryValue(CPU_MEMORY_MAP.Stack + (--cpu.REG.SP), cpu.REG.P)

    cpu.REG.PC = irqInterruptVector
  }

  return {
    execute
  }
}
