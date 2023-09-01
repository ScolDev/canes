import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const currentXRegister = cpu.REG.X

    cpu.setRegister(CPU_REGISTERS.SP, currentXRegister)
    updateStatus(cpu.REG.SP)
  }

  const updateStatus = (newXRegister) => {
    cpuALU.updateZeroFlag(newXRegister)
    cpuALU.updateNegativeFlag(newXRegister)
  }

  return {
    execute
  }
}
