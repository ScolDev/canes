import { type CPUState } from '../types'
import { CPUClock } from './cpu-clock'

export const CPUInitialState: CPUState = {
  clock: {
    frequency: CPUClock.NTSC,
    cycles: 0,
    lastExtraCycles: 0,
    lastInstructionCycles: 0
  },
  paused: false,
  debugMode: false,
  insExecuted: 0,
  lastExecuted: {
    opcode: -1,
    asm: ''
  },
  lastWrite: { address: -1, value: -1 }
}
