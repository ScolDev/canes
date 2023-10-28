import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const currentAccumulator = cpu.getRegister(CPU_REGISTERS.A)

    cpu.setRegister(CPU_REGISTERS.X, currentAccumulator)
    updateStatus(cpu.getRegister(CPU_REGISTERS.X))
  }

  const updateStatus = (newXRegister) => {
    cpuALU.updateZeroFlag(newXRegister)
    cpuALU.updateNegativeFlag(newXRegister)
  }

  return {
    execute
  }
}
