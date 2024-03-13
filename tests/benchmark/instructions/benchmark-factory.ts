import { CPUClock } from 'src/nes/components/core/cpu/consts/cpu-clock'
import { BenchmarkTypes } from './consts/benchmark-types'
import { executeAverageOnInstructionCycles, executeByInstructionCycles } from './strategies'
import { type BenchmarkConfig } from './types'

export class BenchmarkFactory {
  create (benchmarkType: string): BenchmarkConfig {
    if (benchmarkType === undefined || benchmarkType === BenchmarkTypes.basic) {
      return {
        title: `[BASIC] Benchmark to run CPU instructions based on their CPU  cycles (${CPUClock.NTSC} cycles per instruction)`,
        strategy: executeByInstructionCycles
      }
    } else if (benchmarkType === BenchmarkTypes.Average) {
      return {
        title: '[AVERAGE] Benchmark to run the basic benchmark multiple times and average it.',
        strategy: executeAverageOnInstructionCycles
      }
    }

    throw Error(
      `The specified benchmark type '${benchmarkType}' was not found.`
    )
  }
}
