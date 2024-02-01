import { type BaseInstruction } from '../../../src/core/cpu/components/instructions/base-instruction'
import { InstructionsTable } from '../../../src/core/cpu/components/instructions/instructions-table'
import { CPU } from '../../../src/core/cpu/cpu'
import { addrModes } from './consts/addr-modes'
import {
  type BenchmarkConfig,
  type BenchmarkStrategy,
  type BenchmarkResult
} from './types'
import { descendingOrder, logSummary } from './utils/utils'

const cpu = CPU.create()
const instTable = InstructionsTable(cpu)
const instModule = cpu.getComponents().instruction

function executeBenchmark (
  opcode: number,
  instruction: BaseInstruction,
  strategy: BenchmarkStrategy
): BenchmarkResult {
  const addrMode = addrModes[instruction.AddressingModes[opcode]]
  const [time, timesExecuted] = strategy({ opcode, instruction, instModule })

  return {
    addrMode,
    opcode,
    name: instruction.name,
    timesExecuted,
    time
  }
}

export function benchMark (config: BenchmarkConfig): void {
  const { title, strategy } = config
  console.log(`Running: ${title}\n`)

  const summary = Object.entries(instTable)
    .map(([opcodeKey, instruction]) =>
      executeBenchmark(Number(opcodeKey), instruction, strategy)
    )
    .sort(descendingOrder)

  logSummary(summary)
}
