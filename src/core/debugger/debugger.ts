import { CPUMemoryMap } from '../memory/consts/memory-map'
import { DebugEvents } from './consts/events'
import { type DebugState, type DebugQueues, type DebugSingleConditions, type DebugBreakpoint, type DebugMemoryBreakpoint, type DebugEventType, type DebugEventCallback, type DebugConditionExpresion, type DebugCpu, type NESDebuggerModule } from './types'

export class Debugger implements NESDebuggerModule {
  private cpu: DebugCpu
  private readonly state: DebugState = {
    cpuState: null,
    conditions: {
      insExecuted: 0,
      atResetVector: false,
      breakpoints: [],
      memory: []
    }
  }

  private readonly debugQueues: DebugQueues = {
    pause: []
  }

  attach (cpuToAttach: DebugCpu): void {
    this.cpu = cpuToAttach

    this.cpu.debug(this)
    this.initComponents()
  }

  run (): void {
    this.cpu.powerUp()
  }

  breakOn (conditions: DebugSingleConditions): void {
    if (this.state === null) return

    const { insExecuted, atResetVector } = conditions
    this.state.conditions.insExecuted = insExecuted ?? this.state.conditions.insExecuted
    this.state.conditions.atResetVector = atResetVector ?? false
  }

  addBreakpoint (breakpoint: DebugBreakpoint): void {
    this.state.conditions.breakpoints.push(breakpoint)
  }

  addMemoryBreakpoint (memoryBreakpoint: DebugMemoryBreakpoint): void {
    this.state.conditions.memory.push(memoryBreakpoint)
  }

  validate (): void {
    if (this.state.cpuState !== null && this.state.cpuState.paused) return

    this.validateAtResetVector()
    this.validateSingleConditions()
    this.validateBreakpoints()
    this.validateMemoryConditions()
  }

  on (event: DebugEventType, cb: DebugEventCallback): void {
    if (event === DebugEvents.Pause) {
      this.debugQueues.pause.push(cb)
    }
  }

  private validateAtResetVector (): void {
    const { memory } = this.cpu.getComponents()
    const { atResetVector } = this.state.conditions

    const currentPC = this.cpu.getPC()
    const resetVector = memory.loadWord(CPUMemoryMap.Reset_Vector)
    if (atResetVector && currentPC === resetVector) {
      this.pause()
    }
  }

  private validateSingleConditions (): void {
    if (this.state.cpuState === null) return

    const { insExecuted } = this.state.cpuState
    if (insExecuted === this.state.conditions.insExecuted) {
      this.pause()
    }
  }

  private validateBreakpoints (): void {
    const currentPC = this.cpu.getPC()
    for (const breakpoint of this.state.conditions.breakpoints) {
      if (currentPC === breakpoint) {
        this.pause()
        return
      }
    }
  }

  private validateMemoryConditions (): void {
    if (this.state.cpuState === null) return

    const { lastWrite } = this.state.cpuState

    for (const condition of this.state.conditions.memory) {
      const { address, value } = lastWrite
      const didWrite = condition.onWrite && condition.address === address

      if (didWrite && this.expressions(value, condition)) {
        this.pause(); return
      }
    }
  }

  private expressions (memoryValue: number, condition: DebugConditionExpresion): boolean {
    const { equalsTo, greaterThanOrEquals, lessThanOrEquals } = condition
    let match = false

    if (equalsTo !== undefined) {
      match = match || (memoryValue === equalsTo)
    }
    if (greaterThanOrEquals !== undefined) {
      match = match || memoryValue >= greaterThanOrEquals
    }
    if (lessThanOrEquals !== undefined) {
      match = match || (memoryValue <= lessThanOrEquals)
    }

    return match
  }

  private pause (): void {
    if (this.state.cpuState === null) return

    const { cpuState } = this.state
    const onPauseCallbacks = this.debugQueues.pause
    const event = {
      type: DebugEvents.Pause,
      data: {
        cpuState,
        pc: this.cpu.getPC()
      }
    }

    cpuState.paused = true
    for (const cb of onPauseCallbacks) {
      setTimeout(() => { cb(event) }, 0)
    }
  }

  private initComponents (): void {
    if (this.cpu !== undefined) {
      this.state.cpuState = this.cpu.getCPUState()
      this.state.conditions = {
        insExecuted: -1,
        atResetVector: false,
        breakpoints: [],
        memory: []
      }
    }
  }
}
