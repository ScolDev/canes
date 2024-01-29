import { type DebugState } from '../types'

export const DebugInitialState: DebugState = {
  cpuState: undefined,
  conditions: {
    insExecuted: -1,
    atResetVector: false,
    breakpoints: [],
    memory: []
  }
}
