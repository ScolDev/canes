import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const currentXRegister = cpu.getRegister(CPU_REGISTERS.X)

    cpu.setRegister(CPU_REGISTERS.SP, currentXRegister)
    updateStatus(cpu.getRegister(CPU_REGISTERS.SP))
  }

  const updateStatus = (newXRegister) => {
    cpuALU.updateZeroFlag(newXRegister)
    cpuALU.updateNegativeFlag(newXRegister)
  }

  return {
    execute
  }
}
