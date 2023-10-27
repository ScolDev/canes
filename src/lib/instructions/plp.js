import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const execute = (opcode, operand) => {
    const currentSP = cpu.REG.SP
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = cpu.getMemoryValue(stackMemoryAddress)

    cpu.setRegister(CPU_REGISTERS.P, memoryValue)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP + 1)
  }

  return {
    execute
  }
}
