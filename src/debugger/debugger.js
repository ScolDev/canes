import { CPU_MEMORY_MAP } from '../cpu/consts/memory-map'

export const Debugger = (cpu) => {
  const cpuController = cpu.getCPUController()
  const eventQueue = {
    pause: []
  }
  const conditions = {
    instructionsExecuted: -1,
    atResetVector: false,
    breakpoints: [],
    memory: []
  }

  const breakOn = (conds) => {
    conditions.instructionsExecuted = conds.instructionsExecuted ?? conditions.instructionsExecuted
    conditions.atResetVector = !!conds.atResetVector
  }

  const addBreakpoint = (breakpoint) => {
    conditions.breakpoints.push(breakpoint)
  }

  const addMemoryBreakpoint = (memoryBreakpoint) => {
    conditions.memory.push(memoryBreakpoint)
  }

  const validate = () => {
    if (cpuController.paused) return

    _validateAtResetVector()
    _validateSingleConditions()
    _validateBreakpoints()
    _validateMemoryConditions()
  }

  const on = (event, cb) => {
    if (eventQueue[event]) {
      const callbacks = eventQueue[event]
      callbacks.push(cb)
    }
  }

  const _validateAtResetVector = () => {
    const currentPC = cpu.getPC()
    const resetVector = cpu.loadWord(CPU_MEMORY_MAP.Reset_Vector)
    if (conditions.atResetVector && currentPC === resetVector) {
      _pause()
    }
  }

  const _validateSingleConditions = () => {
    if (cpuController.instructionsExecuted === conditions.instructionsExecuted) {
      _pause()
    }
  }

  const _validateBreakpoints = () => {
    const currentPC = cpu.getPC()
    for (const breakpoint of conditions.breakpoints) {
      if (currentPC === breakpoint) {
        _pause()
        return
      }
    }
  }

  const _validateMemoryConditions = () => {
    const { lastWrite } = cpuController
    let match = false

    for (const condition of conditions.memory) {
      if (!Number.isInteger(condition.address)) continue

      const { address, value } = lastWrite
      const didWrite = condition.onWrite && condition.address === address

      if (didWrite) {
        match = _equalsTo(value, condition.equalsTo) || match
        match = _expressions(value, condition) || match
      }

      if (match) {
        return _pause()
      }
    }
  }

  const _equalsTo = (memoryValue, equalsTo) => {
    if (!Number.isInteger(equalsTo)) {
      return false
    }
    return memoryValue === equalsTo
  }

  const _expressions = (memoryValue, condition) => {
    const { greaterThanOrEquals, lessThanOrEquals } = condition

    if (!Number.isInteger(greaterThanOrEquals) || !Number.isInteger(lessThanOrEquals)) {
      return false
    }

    return memoryValue >= greaterThanOrEquals && memoryValue <= lessThanOrEquals
  }

  const _pause = () => {
    cpuController.paused = true
    const onPauseCallbacks = eventQueue.pause
    const event = {
      cpuController,
      pc: cpu.getPC(),
      lastExecuted: cpu.getLastExecuted()
    }

    for (const cb of onPauseCallbacks) {
      cb(event)
    }
  }

  return {
    addBreakpoint,
    addMemoryBreakpoint,
    breakOn,
    validate,
    on
  }
}
