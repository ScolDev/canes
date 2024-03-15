import { type InstructionSummary, type BenchmarkResult } from '../types'

export function descendingOrder (a: BenchmarkResult, b: BenchmarkResult): number {
  return b.time - a.time
}

export function logSummary (summaries: InstructionSummary[]): void {
  console.log('Instruction\t\tTime\t\tTimes Executed\n')

  summaries.forEach((summary) => {
    const instruction = `${summary.name} (${summary.addrMode})`.padEnd(22, ' ')
    const timesExecuted = Math.round(summary.timesExecuted)

    console.log(`${instruction}\t${summary.time} ms\t\t${timesExecuted}`)
  })

  const totalTime = summaries.reduce((accu, current) => accu + current.time, 0)
  console.log(`\nSummary: ${totalTime / 1000} seconds.`)
}
