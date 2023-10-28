import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode, operand) => {
    const negativeFlag = cpuALU.getFlag(CPU_FLAGS.NegativeFlag)
    let nextPCAddress = cpu.getRegister(CPU_REGISTERS.PC) + 2

    if (negativeFlag) {
      nextPCAddress += cpuALU.getSignedByte(operand)
    }

    cpu.setRegister(CPU_REGISTERS.PC, nextPCAddress)
  }

  return {
    execute
  }
}
