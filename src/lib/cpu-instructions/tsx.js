import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const stackPointer = cpu.REG.SP

    cpu.setRegister(CPU_REGISTERS.X, stackPointer)
    updateStatus(cpu.REG.X)
  }

  const updateStatus = (newXRegister) => {
    cpuALU.updateZeroFlag(newXRegister)
    cpuALU.updateNegativeFlag(newXRegister)
  }

  return {
    execute
  }
}
