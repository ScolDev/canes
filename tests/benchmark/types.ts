import { type NESInstructionComponent } from 'src/nes/core/instructions/types'
import { type BenchmarkStrategyConfig } from './instructions/types'
import { type CPUAddrMode } from 'src/nes/core/addressing-modes/types'

export type AddrModes = Record<CPUAddrMode, string>

export interface BenchmarkConfig {
  title: string
  instModule: NESInstructionComponent
  strategy: (config: BenchmarkStrategyConfig) => [time: number, timesExecuted: number]
}

export interface InstructionSummary {
  addrMode: string
  opcode: number
  name: string
  timesExecuted: number
  time: number
}
