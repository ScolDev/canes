import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const execute = (opcode, operand) => {
    const newStackPointer = cpu.getRegister(CPU_REGISTERS.SP) + 2
    const stackMemoryAddress = cpu.getRegister(CPU_REGISTERS.SP) + 0x100
    const loadedPC = cpu.loadWord(stackMemoryAddress + 1)
    const newPC = loadedPC + 1

    cpu.setRegister(CPU_REGISTERS.PC, newPC)
    cpu.setRegister(CPU_REGISTERS.SP, newStackPointer)
  }

  return {
    execute
  }
}
