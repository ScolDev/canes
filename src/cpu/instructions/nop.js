import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const execute = (opcode, operand) => {
    const currentPC = cpu.REG.PC
    cpu.setRegister(CPU_REGISTERS.PC, currentPC + 1)
  }

  return {
    execute
  }
}
