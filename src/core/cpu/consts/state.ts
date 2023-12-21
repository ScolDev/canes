import { type CPUState } from '../types'

export const InitialCPUState: CPUState = {
  paused: false,
  debugMode: false,
  insExecuted: 0,
  lastExecuted: {
    opcode: -1,
    asm: ''
  },
  lastWrite: { address: -1, value: -1 }
}
