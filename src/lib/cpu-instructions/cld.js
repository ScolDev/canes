import CPU_FLAGS from '../cpu-consts/cpu-flags'

export default (cpuALU) => {
  const execute = () => {
    cpuALU.clearFlag(CPU_FLAGS.DecimalModeFlag)
  }

  return {
    execute
  }
}
