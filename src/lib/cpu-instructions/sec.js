import CPU_FLAGS from '../cpu-consts/cpu-flags'

export default (cpuALU) => {
  const execute = (opcode, operand) => {
    cpuALU.setFlag(CPU_FLAGS.CarryFlag)
  }

  return {
    execute
  }
}
