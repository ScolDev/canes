import { CPU_MEMORY_MAP } from '../cpu/consts/memory-map'

export const Debugger = () => {
  let cpu = null
  const eventQueue = {
    pause: []
  }
  const state = {
    cpuController: null,
    conditions: null
  }

  const attach = (attachedCPU) => {
    cpu = attachedCPU

    cpu.debug(debug)
    _init()
  }

  const run = () => {
    cpu.powerUp()
  }

  const breakOn = (config) => {
    const { insExecuted, atResetVector } = config

    state.conditions.insExecuted = Number.isInteger(insExecuted)
      ? insExecuted
      : state.conditions.insExecuted
    state.conditions.atResetVector = !!atResetVector
  }

  const addBreakpoint = (breakpoint) => {
    state.conditions.breakpoints.push(breakpoint)
  }

  const addMemoryBreakpoint = (memoryBreakpoint) => {
    state.conditions.memory.push(memoryBreakpoint)
  }

  const validate = () => {
    if (state.cpuController?.paused) return

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
    if (state.conditions.atResetVector && currentPC === resetVector) {
      _pause()
    }
  }

  const _validateSingleConditions = () => {
    if (state.cpuController.insExecuted === state.conditions.insExecuted) {
      _pause()
    }
  }

  const _validateBreakpoints = () => {
    const currentPC = cpu.getPC()
    for (const breakpoint of state.conditions.breakpoints) {
      if (currentPC === breakpoint) {
        _pause()
        return
      }
    }
  }

  const _validateMemoryConditions = () => {
    const { lastWrite } = state.cpuController
    let match = false

    for (const condition of state.conditions.memory) {
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
    const { cpuController } = state
    const onPauseCallbacks = eventQueue.pause
    const event = {
      cpuController,
      pc: cpu.getPC(),
      lastExecuted: cpu.getLastExecuted()
    }

    cpuController.paused = true
    for (const cb of onPauseCallbacks) {
      cb(event)
    }
  }

  const _init = () => {
    if (cpu) {
      state.cpuController = cpu.getCPUController()
      state.conditions = {
        insExecuted: -1,
        atResetVector: false,
        breakpoints: [],
        memory: []
      }
    }
  }

  const debug = {
    attach,
    addBreakpoint,
    addMemoryBreakpoint,
    breakOn,
    validate,
    on,
    run
  }

  return debug
}
