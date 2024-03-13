import { type BaseInstruction } from 'src/nes/components/core/cpu/components/instructions/base-instruction'
import { CPUClock } from 'src/nes/components/core/cpu/consts/cpu-clock'
import { type CPUInstruction } from 'src/nes/components/core/cpu/types'
import { type BenchmarkStrategyConfig } from './types'

export function executeAverageOnInstructionCycles (config: BenchmarkStrategyConfig): [time: number, timesExecuted: number] {
  const TIMES_TO_RUN = 6
  let times = []
  let executedTimes = 0

  for (let i = 0; i < TIMES_TO_RUN; i++) {
    const [time, numOfExecutions] = executeByInstructionCycles(config)

    executedTimes = numOfExecutions
    times.push(time)
  }

  // Removes the maximus and minimun times
  times = times.sort((a, b) => b - a)
    .slice(1, times.length - 1)

  const totalTime = Math.round(times.reduce((acc, prev) => acc + prev, 0) / (TIMES_TO_RUN - 2))
  return [totalTime, executedTimes]
}

export function executeByInstructionCycles ({
  opcode,
  instruction,
  instModule
}: BenchmarkStrategyConfig): [time: number, timesExecuted: number] {
  const cycles = instModule.getInstructionCycles([opcode] as CPUInstruction)
  const timesToExecute = CPUClock.NTSC / cycles

  const time = executeTimes(opcode, instruction, timesToExecute)
  return [time, timesToExecute]
}

function executeTimes (
  opcode: number,
  ins: BaseInstruction,
  times: number
): number {
  const start = Date.now()

  for (let i = 0; i < times; i++) {
    ins.execute(opcode, 0x00)
  }

  return Date.now() - start
}
