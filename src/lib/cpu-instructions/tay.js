import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const currentAccumulator = cpu.REG.A

    cpu.setRegister(CPU_REGISTERS.Y, currentAccumulator)
    updateStatus(cpu.REG.Y)
  }

  const updateStatus = (newYRegister) => {
    cpuALU.updateZeroFlag(newYRegister)
    cpuALU.updateNegativeFlag(newYRegister)
  }

  return {
    execute
  }
}
