import CPU_DATA_SIZE from '../cpu-consts/cpu-data-size'
import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_MEMORY_MAP from '../cpu-consts/cpu-memory-map'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const execute = (opcode, operand) => {
    const pcl = (cpu.REG.PC & 0xff) + 2
    const pch = (cpu.REG.PC & 0xff00) >> 8
    const irqInterruptVector = cpu.getMemoryValue(CPU_MEMORY_MAP.IRQ_Vector, CPU_DATA_SIZE.Word)

    cpuALU.setFlag(CPU_FLAGS.BreakCommand)

    cpu.setMemoryValue(CPU_MEMORY_MAP.Stack + cpu.REG.SP, pcl)
    cpu.setMemoryValue(CPU_MEMORY_MAP.Stack + (--cpu.REG.SP), pch)
    cpu.setMemoryValue(CPU_MEMORY_MAP.Stack + (--cpu.REG.SP), cpu.REG.P)

    cpu.setRegister(CPU_REGISTERS.PC, irqInterruptVector)
  }

  return {
    execute
  }
}
