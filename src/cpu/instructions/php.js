import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const execute = (opcode, operand) => {
    const processorStatus = cpu.getRegister(CPU_REGISTERS.P)
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)

    const stackMemoryAddress = 0x100 + currentSP

    cpu.store(stackMemoryAddress, processorStatus)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP - 1)
  }

  return {
    execute
  }
}
