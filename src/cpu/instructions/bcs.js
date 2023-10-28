import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const execute = (opcode, operand) => {
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    let nextPCAddress = cpu.getRegister(CPU_REGISTERS.PC) + 2

    if (carryFlag) {
      nextPCAddress += cpuALU.getSignedByte(operand)
    }

    cpu.setRegister(CPU_REGISTERS.PC, nextPCAddress)
  }

  return {
    execute
  }
}
