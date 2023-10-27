import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode, operand) => {
    const overflowFlag = cpuALU.getFlag(CPU_FLAGS.OverflowFlag)
    let nextPCAddress = cpu.REG.PC + 2

    if (!overflowFlag) {
      nextPCAddress += cpuALU.getSignedByte(operand)
    }

    cpu.setRegister(CPU_REGISTERS.PC, nextPCAddress)
  }

  return {
    execute
  }
}