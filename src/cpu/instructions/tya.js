import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const currentYRegister = cpu.getRegister(CPU_REGISTERS.Y)

    cpu.setRegister(CPU_REGISTERS.A, currentYRegister)
    updateStatus(cpu.getRegister(CPU_REGISTERS.A))
  }

  const updateStatus = (newAccumulator) => {
    cpuALU.updateZeroFlag(newAccumulator)
    cpuALU.updateNegativeFlag(newAccumulator)
  }

  return {
    execute
  }
}
