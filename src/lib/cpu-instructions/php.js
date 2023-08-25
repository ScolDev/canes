import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu) => {
  const execute = (opcode, operand) => {
    const processorStatus = cpu.REG.P
    const currentSP = cpu.REG.SP

    const stackMemoryAddress = 0x100 + currentSP

    cpu.setMemoryValue(stackMemoryAddress, processorStatus)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP - 1)
  }

  return {
    execute
  }
}
