import { CPUMemoryMap } from '../../../core/memory/consts/memory-map'
import { DebugEvents } from './consts/events'
import {
  type DebugState,
  type DebugQueues,
  type DebugSingleConditions,
  type DebugBreakpoint,
  type DebugMemoryBreakpoint,
  type DebugEventType,
  type DebugEventCallback,
  type DebugConditionExpresion,
  type NESDebuggerComponent,
  type NESDebuggerComponents
} from './types'
import { DebugInitialState } from './consts/state'
import { type NESControlBus } from '../../../core/control-bus/types'
import { type NESDisASMComponent } from '../disasm/types'
import DisASM from '../disasm/disasm'

export class Debugger implements NESDebuggerComponent {
  private readonly state: DebugState = structuredClone({ ...DebugInitialState })
  private readonly disASM: NESDisASMComponent

  private readonly debugQueues: DebugQueues = {
    pause: []
  }

  private constructor (readonly control: NESControlBus) {
    this.state.cpuState = this.control.cpu.getCPUState()
    this.disASM = DisASM.create(this.control)
  }

  getComponents (): NESDebuggerComponents {
    return {
      disASM: this.disASM
    }
  }

  run (): void {
    this.control.cpu.powerUp()
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

  validate (): void {
    if (this.state.cpuState.paused) return

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
    const { atResetVector } = this.state.conditions

    const currentPC = this.control.cpu.getPC()
    const resetVector = this.control.memory.loadWord(CPUMemoryMap.Reset_Vector)
    if (atResetVector && currentPC === resetVector) {
      this.pause()
    }
  }

  private validateSingleConditions (): void {
    const { insExecuted } = this.state.cpuState
    if (insExecuted === this.state.conditions.insExecuted) {
      this.pause()
    }
  }

  private validateBreakpoints (): void {
    const currentPC = this.control.cpu.getPC()
    for (const breakpoint of this.state.conditions.breakpoints) {
      if (currentPC === breakpoint) {
        this.pause()
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
        this.pause()
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

  private pause (): void {
    const { cpuState } = this.state
    const onPauseCallbacks = this.debugQueues.pause
    const event = {
      type: DebugEvents.Pause,
      data: {
        cpuState,
        pc: this.control.cpu.getPC()
      }
    }

    cpuState.paused = true
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
