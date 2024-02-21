import { CPUInitialState } from '../../core/cpu/consts/state'
import { type DebugState } from '../types'

export const DebugInitialState: DebugState = {
  cpuState: structuredClone(CPUInitialState),
  conditions: {
    insExecuted: -1,
    atResetVector: false,
    breakpoints: [],
    memory: []
  }
}
