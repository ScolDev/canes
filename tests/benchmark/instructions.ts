import { InstructionsTable } from '../../src/core/cpu/components/instructions/instructions-table'
import { CPUClock } from '../../src/core/cpu/consts/cpu-clock'
import { CPU } from '../../src/core/cpu/cpu'
import { addrModes } from './consts/addr-modes'
import { executeByInstructionCycles } from './strategies'
import { type BenchmarkConfig, type InstructionSummary } from './types/benchmark-types'

const cpu = CPU.create()
const instModule = cpu.getComponents().instruction
const instTable = InstructionsTable(cpu)

const benchmarkByCycles = {
  title: `Benchmark for CPU instructions cycles (${CPUClock.NTSC} cycles per instruction)`,
  strategy: executeByInstructionCycles,
  instModule
}

benchMark(benchmarkByCycles)

function benchMark (config: BenchmarkConfig): void {
  const { title, strategy, instModule } = config

  console.log(`Executing: ${title}\n`)
  const summary = Object.entries(instTable)
    .map(([opcode, instruction]) => {
      const opcodeIns = Number(opcode)
      const addrMode = addrModes[instruction.AddressingModes[opcodeIns]]
      const [time, timesExecuted] = strategy(
        Number(opcode),
        instruction,
        instModule
      )

      return {
        addrMode,
        opcode: opcodeIns,
        name: instruction.name,
        timesExecuted,
        time
      }
    })
    .sort((a, b) => b.time - a.time)

  logSummary(summary)
}

function logSummary (summaries: InstructionSummary[]): void {
  console.log('Instruction\t\tTime\t\tTimes Executed\n')

  summaries.forEach((summary) => {
    const instruction = `${summary.name} (${summary.addrMode})`.padEnd(22, ' ')
    console.log(
      `${instruction}\t${summary.time} ms\t\t${Math.floor(
        summary.timesExecuted
      )}`
    )
  })

  console.log(
    `\nSummary: ${summaries.reduce(
      (accu, current) => accu + current.time,
      0
    )} ms.`
  )
}
