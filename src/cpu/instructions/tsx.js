import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const stackPointer = cpu.getRegister(CPU_REGISTERS.SP)

    cpu.setRegister(CPU_REGISTERS.X, stackPointer)
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
