import { type BaseInstruction } from '../../src/core/cpu/components/instructions/base-instruction'
import { CPUClock } from '../../src/core/cpu/consts/cpu-clock'
import {
  type NESInstructionComponent,
  type CPUInstruction
} from '../../src/core/cpu/types'

export function executeByInstructionCycles (
  opcode: number,
  instruction: BaseInstruction,
  instModule: NESInstructionComponent
): [time: number, timesExecuted: number] {
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
