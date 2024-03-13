import { type BaseInstruction } from 'src/nes/components/core/cpu/components/instructions/base-instruction'
import { type CPUAddrMode, type NESInstructionComponent } from 'src/nes/components/core/cpu/types'

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
