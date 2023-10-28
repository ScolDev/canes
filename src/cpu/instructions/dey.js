import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode) => {
    const registerValue = cpu.getRegister(CPU_REGISTERS.Y)
    const resultValue = (registerValue - 1) & 0xff

    cpu.setRegister(CPU_REGISTERS.Y, resultValue)
    updateStatus(resultValue)
  }

  const updateStatus = (result) => {
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
