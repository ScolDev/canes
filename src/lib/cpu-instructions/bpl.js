import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const execute = (opcode, operand) => {
    const negativeFlag = cpuALU.getFlag(CPU_FLAGS.NegativeFlag)
    let nextPCAddress = cpu.REG.PC + 2

    if (!negativeFlag) {
      nextPCAddress += cpuALU.getSignedByte(operand)
    }

    cpu.setRegister(CPU_REGISTERS.PC, nextPCAddress)
  }

  return {
    execute
  }
}
