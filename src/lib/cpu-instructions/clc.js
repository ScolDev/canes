import CPU_FLAGS from '../cpu-consts/cpu-flags'

export default (cpuALU) => {
  const execute = (opcode, operand) => {
    cpuALU.clearFlag(CPU_FLAGS.CarryFlag)
  }

  return {
    execute
  }
}
