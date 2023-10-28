import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode, operand) => {
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = cpu.load(stackMemoryAddress)

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
