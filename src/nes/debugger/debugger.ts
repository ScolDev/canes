import { DebugEvents } from './consts/events'
import {
  type DebugState,
  type DebugSingleConditions,
  type DebugBreakpoint,
  type DebugMemoryBreakpoint,
  type DebugEventType,
  type DebugEventCallback,
  type DebugConditionExpresion,
  type NESDebuggerComponent,
  type NESDebuggerComponents,
  type DebugListeners
} from './types'
import { DebugInitialState } from './consts/state'
import { type NESDisASMComponent } from '../disasm/types'
import DisASM from '../disasm/disasm'
import { type NESControlBus } from '../core/control-bus/types'
import { CPUMemoryMap } from '../core/memory/consts/memory-map'

export class Debugger implements NESDebuggerComponent {
  private readonly state: DebugState = structuredClone({ ...DebugInitialState })
  private readonly disASM: NESDisASMComponent

  private readonly debugListeners: DebugListeners = {
    pause: []
  }

  private constructor (readonly control: NESControlBus) {
    this.state.cpuState = this.control.cpu.getCPUState()
    this.disASM = DisASM.create()
  }

  getComponents (): NESDebuggerComponents {
    return {
      disASM: this.disASM
    }
  }

  getState (): DebugState {
    return this.state
  }

  run (): void {
    this.control.cpu.powerUp()
  }

  pause (): void {
    this.pauseDebug()
  }

  breakOn (conditions: DebugSingleConditions): void {
    if (this.state === null) return

    const { insExecuted, atResetVector } = conditions
    this.state.conditions.insExecuted =
      insExecuted ?? this.state.conditions.insExecuted
    this.state.conditions.atResetVector = atResetVector ?? false
  }

  addBreakpoint (breakpoint: DebugBreakpoint): void {
    this.state.conditions.breakpoints.push(breakpoint)
  }

  addMemoryBreakpoint (memoryBreakpoint: DebugMemoryBreakpoint): void {
    this.state.conditions.memory.push(memoryBreakpoint)
  }

  isActive (): boolean {
    return this.control.cpu.isDebugged()
  }

  validate (): void {
    if (!this.state.cpuState.isRunning) return

    this.validateAtResetVector()
    this.validateSingleConditions()
    this.validateBreakpoints()
    this.validateMemoryConditions()
  }

  on (event: DebugEventType, cb: DebugEventCallback): void {
    if (event === DebugEvents.Pause) {
      this.debugListeners.pause.push(cb)
    }
  }

  private validateAtResetVector (): void {
    const { atResetVector } = this.state.conditions

    const currentPC = this.control.cpu.getPC()
    const resetVector = this.control.memory.loadWord(CPUMemoryMap.Reset_Vector)
    if (atResetVector && currentPC === resetVector) {
      this.pauseDebug()
    }
  }

  private validateSingleConditions (): void {
    const { insExecuted } = this.state.cpuState
    if (insExecuted === this.state.conditions.insExecuted) {
      this.pauseDebug()
    }
  }

  private validateBreakpoints (): void {
    const currentPC = this.control.cpu.getPC()
    for (const breakpoint of this.state.conditions.breakpoints) {
      if (currentPC === breakpoint) {
        this.pauseDebug()
        return
      }
    }
  }

  private validateMemoryConditions (): void {
    const { lastWrite } = this.state.cpuState

    for (const condition of this.state.conditions.memory) {
      const { address, value } = lastWrite
      const didWrite = condition.onWrite && condition.address === address

      if (didWrite && this.expressions(value, condition)) {
        this.pauseDebug()
        return
      }
    }
  }

  private expressions (
    memoryValue: number,
    condition: DebugConditionExpresion
  ): boolean {
    const { equalsTo, greaterThanOrEquals, lessThanOrEquals } = condition
    let match = false

    if (equalsTo !== undefined) {
      match = match || memoryValue === equalsTo
    }
    if (greaterThanOrEquals !== undefined) {
      match = match || memoryValue >= greaterThanOrEquals
    }
    if (lessThanOrEquals !== undefined) {
      match = match || memoryValue <= lessThanOrEquals
    }

    return match
  }

  private pauseDebug (): void {
    const { cpuState } = this.state
    const onPauseCallbacks = this.debugListeners.pause
    const event = {
      type: DebugEvents.Pause,
      data: {
        cpuState,
        pc: this.control.cpu.getPC()
      }
    }

    cpuState.isRunning = false
    for (const cb of onPauseCallbacks) {
      setTimeout(() => {
        cb(event)
      }, 0)
    }
  }

  static create (control: NESControlBus): NESDebuggerComponent {
    return new Debugger(control)
  }
}
