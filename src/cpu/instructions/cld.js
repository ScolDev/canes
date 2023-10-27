import { CPU_FLAGS } from '../consts/flags'

export default (cpuALU) => {
  const execute = () => {
    cpuALU.clearFlag(CPU_FLAGS.DecimalModeFlag)
  }

  return {
    execute
  }
}
