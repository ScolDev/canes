import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const execute = (opcode, operand) => {
    const accumulator = cpu.getRegister(CPU_REGISTERS.A)
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)

    const stackMemoryAddress = 0x100 + currentSP

    cpu.store(stackMemoryAddress, accumulator)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP - 1)
  }

  return {
    execute
  }
}
