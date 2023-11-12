export const Debugger = (cpu) => {
  const cpuController = cpu.getCPUController()
  const conditions = {
    breakpoints: [],
    instructionsExecuted: -1
  }

  const setConditions = (_conditions) => {
    conditions.breakpoints = _conditions.breakpoints || conditions.breakpoints
    conditions.instructionsExecuted = _conditions.instructionsExecuted || conditions.instructionsExecuted
  }

  const validate = () => {
    const currentPC = cpu.getPC()

    for (const breakpoint of conditions.breakpoints) {
      if (currentPC === breakpoint) {
        _pause()
        return
      }
    }

    if (cpuController.instructionsExecuted === conditions.instructionsExecuted) {
      _pause()
    }
  }

  const _pause = () => {
    cpuController.paused = true
  }

  return {
    setConditions,
    validate
  }
}
