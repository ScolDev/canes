import CPU_FLAGS from '../cpu-consts/cpu-flags'

export default (cpuALU) => {
  const execute = () => {
    cpuALU.setFlag(CPU_FLAGS.InterruptDisable)
  }

  return {
    execute
  }
}
