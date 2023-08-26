import CPU_REGISTERS from '../cpu-consts/cpu-registers'
import CPU_DATA_SIZE from '../cpu-consts/cpu-data-size'

export default (cpu) => {
  const execute = (opcode, operand) => {
    const currentSP = cpu.REG.SP
    const stackMemoryAddress = 0x100 + currentSP
    const processorStatus = cpu.getMemoryValue(stackMemoryAddress)
    const pc = cpu.getMemoryValue(stackMemoryAddress + 1, CPU_DATA_SIZE.Word)

    cpu.setRegister(CPU_REGISTERS.P, processorStatus)
    cpu.setRegister(CPU_REGISTERS.PC, pc)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP + 2)
  }

  return {
    execute
  }
}
