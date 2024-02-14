import { type BaseInstruction } from '../../../src/core/cpu/components/instructions/base-instruction'
import { type CPUAddrMode, type NESInstructionComponent } from '../../../src/core/cpu/types'

export type AddrModes = Record<CPUAddrMode, string>

export interface BenchmarkConfig {
  title: string
  instModule: NESInstructionComponent
  strategy: (
    opcode: number,
    instruction: BaseInstruction,
    instModule: NESInstructionComponent
  ) => [time: number, timesExecuted: number]
}

export interface InstructionSummary {
  addrMode: string
  opcode: number
  name: string
  timesExecuted: number
  time: number
}
