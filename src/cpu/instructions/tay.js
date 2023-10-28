import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const currentAccumulator = cpu.getRegister(CPU_REGISTERS.A)

    cpu.setRegister(CPU_REGISTERS.Y, currentAccumulator)
    updateStatus(cpu.getRegister(CPU_REGISTERS.Y))
  }

  const updateStatus = (newYRegister) => {
    cpuALU.updateZeroFlag(newYRegister)
    cpuALU.updateNegativeFlag(newYRegister)
  }

  return {
    execute
  }
}
