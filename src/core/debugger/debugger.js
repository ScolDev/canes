import { CPU_MEMORY_MAP } from '../memory/consts/memory-map'

export class Debugger {
  #cpu = null
  #eventQueue = {
    pause: []
  }

  #state = {
    cpuController: null,
    conditions: null
  }

  attach (attachedCPU) {
    this.#cpu = attachedCPU

    this.#cpu.debug(this)
    this.#init()
  }

  run () {
    this.#cpu.powerUp()
  }

  breakOn (config) {
    const { insExecuted, atResetVector } = config

    this.#state.conditions.insExecuted = Number.isInteger(insExecuted)
      ? insExecuted
      : this.#state.conditions.insExecuted
    this.#state.conditions.atResetVector = !!atResetVector
  }

  addBreakpoint (breakpoint) {
    this.#state.conditions.breakpoints.push(breakpoint)
  }

  addMemoryBreakpoint (memoryBreakpoint) {
    this.#state.conditions.memory.push(memoryBreakpoint)
  }

  validate () {
    if (this.#state.cpuController?.paused) return

    this.#validateAtResetVector()
    this.#validateSingleConditions()
    this.#validateBreakpoints()
    this.#validateMemoryConditions()
  }

  on (event, cb) {
    if (this.#eventQueue[event]) {
      const callbacks = this.#eventQueue[event]
      callbacks.push(cb)
    }
  }

  #validateAtResetVector () {
    const { memory } = this.#cpu.getComponents()
    const currentPC = this.#cpu.getPC()
    const resetVector = memory.loadWord(CPU_MEMORY_MAP.Reset_Vector)
    if (this.#state.conditions.atResetVector && currentPC === resetVector) {
      this.#pause()
    }
  }

  #validateSingleConditions () {
    if (this.#state.cpuController.insExecuted === this.#state.conditions.insExecuted) {
      this.#pause()
    }
  }

  #validateBreakpoints () {
    const currentPC = this.#cpu.getPC()
    for (const breakpoint of this.#state.conditions.breakpoints) {
      if (currentPC === breakpoint) {
        this.#pause()
        return
      }
    }
  }

  #validateMemoryConditions () {
    const { lastWrite } = this.#state.cpuController
    let match = false

    for (const condition of this.#state.conditions.memory) {
      if (!Number.isInteger(condition.address)) continue

      const { address, value } = lastWrite
      const didWrite = condition.onWrite && condition.address === address

      if (didWrite) {
        match = this.#equalsTo(value, condition.equalsTo) || match
        match = this.#expressions(value, condition) || match
      }

      if (match) {
        return this.#pause()
      }
    }
  }

  #equalsTo (memoryValue, equalsTo) {
    if (!Number.isInteger(equalsTo)) {
      return false
    }
    return memoryValue === equalsTo
  }

  #expressions (memoryValue, condition) {
    const { greaterThanOrEquals, lessThanOrEquals } = condition

    if (!Number.isInteger(greaterThanOrEquals) || !Number.isInteger(lessThanOrEquals)) {
      return false
    }

    return memoryValue >= greaterThanOrEquals && memoryValue <= lessThanOrEquals
  }

  #pause () {
    const { cpuController } = this.#state
    const onPauseCallbacks = this.#eventQueue.pause
    const event = {
      cpuController,
      pc: this.#cpu.getPC(),
      lastExecuted: this.#cpu.getLastExecuted()
    }

    cpuController.paused = true
    for (const cb of onPauseCallbacks) {
      cb(event)
    }
  }

  #init () {
    if (this.#cpu) {
      this.#state.cpuController = this.#cpu.getCPUController()
      this.#state.conditions = {
        insExecuted: -1,
        atResetVector: false,
        breakpoints: [],
        memory: []
      }
    }
  }
}
