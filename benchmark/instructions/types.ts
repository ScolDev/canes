import { type CPUAddrMode } from 'src/nes/core/addressing-modes/types'
import { type BaseInstruction } from 'src/nes/core/instructions/base-instruction'
import { type NESInstructionComponent } from 'src/nes/core/instructions/types'

export type AddrModes = Record<CPUAddrMode, string>

export interface BenchmarkStrategyConfig {
  opcode: number
  instruction: BaseInstruction
  instModule: NESInstructionComponent
}

export interface BenchmarkResult {
  opcode: number
  addrMode: string
  name: string
  time: number
  timesExecuted: number
}

export type BenchmarkStrategy = (
  config: BenchmarkStrategyConfig
) => [time: number, timesExecuted: number]

export interface BenchmarkConfig {
  title: string
  strategy: BenchmarkStrategy
}

export interface InstructionSummary {
  addrMode: string
  opcode: number
  name: string
  timesExecuted: number
  time: number
}
