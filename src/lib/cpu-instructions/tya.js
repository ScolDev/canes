import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const currentYRegister = cpu.REG.Y

    cpu.setRegister(CPU_REGISTERS.A, currentYRegister)
    updateStatus(cpu.REG.A)
  }

  const updateStatus = (newAccumulator) => {
    cpuALU.updateZeroFlag(newAccumulator)
    cpuALU.updateNegativeFlag(newAccumulator)
  }

  return {
    execute
  }
}
