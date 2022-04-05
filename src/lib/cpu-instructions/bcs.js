import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'

export default (cpu, cpuALU, cpuInstructions) => {
  const execute = (opcode, operand) => {
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    let nextPCAddress = cpu.REG.PC + 2

    if (carryFlag) {
      nextPCAddress += cpuALU.getSignedByte(operand)
    }

    cpu.setRegister(CPU_REGISTERS.PC, nextPCAddress)
  }

  return {
    execute
  }
}
