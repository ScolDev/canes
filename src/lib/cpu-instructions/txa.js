import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const currentXRegister = cpu.REG.X

    cpu.setRegister(CPU_REGISTERS.A, currentXRegister)
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
