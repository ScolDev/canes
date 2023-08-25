import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const execute = (opcode, operand) => {
    const currentSP = cpu.REG.SP
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = cpu.getMemoryValue(stackMemoryAddress)

    cpu.setRegister(CPU_REGISTERS.A, memoryValue)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP + 1)

    updateStatus(memoryValue)
  }

  const updateStatus = (result) => {
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
