import { type BaseInstruction } from '../../../src/core/cpu/components/instructions/base-instruction'
import { type NESInstructionComponent } from '../../../src/core/cpu/types'

export type BenchmarkStrategy = (
  opcode: number,
  instruction: BaseInstruction,
  instModule?: NESInstructionComponent
) => [time: number, timesExecuted: number]
