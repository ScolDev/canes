import ControlBus from 'src/nes/core/control-bus/control-bus'
import { type BaseInstruction } from 'src/nes/core/instructions/base-instruction'
import { InstructionsTable } from 'src/nes/core/instructions/instructions-table'
import { addrModes } from './consts/addr-modes'
import { type BenchmarkStrategy, type BenchmarkResult, type BenchmarkConfig } from './types'
import { descendingOrder, logSummary } from './utils/utils'

const control = ControlBus.create()
const instTable = InstructionsTable(control)
const instModule = control.getComponents().instruction

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
