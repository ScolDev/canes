import { type DebugState } from '../types'

export const DebugInitialState: DebugState = {
  cpuState: null,
  conditions: {
    insExecuted: 0,
    atResetVector: false,
    breakpoints: [],
    memory: []
  }
}
