import { CPU_FLAGS } from '../consts/flags'

export default (cpuALU) => {
  const execute = () => {
    cpuALU.setFlag(CPU_FLAGS.DecimalModeFlag)
  }

  return {
    execute
  }
}
