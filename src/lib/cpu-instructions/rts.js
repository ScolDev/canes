import CPU_REGISTERS from '../cpu-consts/cpu-registers'
import CPU_DATA_SIZE from '../cpu-consts/cpu-data-size'

export default (cpu) => {
  const execute = (opcode, operand) => {
    const newStackPointer = cpu.REG.SP + 2
    const stackMemoryAddress = cpu.REG.SP + 0x100
    const loadedPC = cpu.getMemoryValue(stackMemoryAddress + 1, CPU_DATA_SIZE.Word)
    const newPC = loadedPC + 1

    cpu.setRegister(CPU_REGISTERS.PC, newPC)
    cpu.setRegister(CPU_REGISTERS.SP, newStackPointer)
  }

  return {
    execute
  }
}
