import { type BaseInstruction } from '../../src/core/cpu/components/instructions/base-instruction'
import { InstructionsTable } from '../../src/core/cpu/components/instructions/instructions-table'
import { CPUAddressingModes } from '../../src/core/cpu/consts/addressing-modes'
import { CPU } from '../../src/core/cpu/cpu'
import { type CPUAddrMode } from '../../src/core/cpu/types'

type AddrModes = Record<CPUAddrMode, string>
interface InstructionTime {
  addrMode: string
  opcode: number
  name: string
  time: number
}

const INS_TO_EXECUTE = 500000
const cpu = CPU.create()
const instTable = InstructionsTable(cpu)

const addrModes: AddrModes = {
  [CPUAddressingModes.Accumulator]: 'Accumulator',
  [CPUAddressingModes.Immediate]: 'Immediate',
  [CPUAddressingModes.ZeroPage]: 'ZeroPage',
  [CPUAddressingModes.ZeroPageX]: 'ZeroPageX',
  [CPUAddressingModes.ZeroPageY]: 'ZeroPageY',
  [CPUAddressingModes.Relative]: 'Relative',
  [CPUAddressingModes.Absolute]: 'Absolute',
  [CPUAddressingModes.AbsoluteX]: 'AbsoluteX',
  [CPUAddressingModes.AbsoluteY]: 'AbsoluteY',
  [CPUAddressingModes.Indirect]: 'Indirect',
  [CPUAddressingModes.IndexedIndirect]: 'IndexedIndirect',
  [CPUAddressingModes.IndirectIndexed]: 'IndirectIndexed',
  [CPUAddressingModes.Implied]: 'Implied'
}

benchMark()

function benchMark (): void {
  console.log('Starting benchmark for CPU instructions...')

  const times = Object.entries(instTable)
    .map(([opcode, instruction]) => {
      const opcodeIns = Number(opcode)
      const addrMode = addrModes[instruction.AddressingModes[opcodeIns]]

      return {
        addrMode,
        opcode: opcodeIns,
        name: instruction.name,
        time: executeInstruction(Number(opcode), instruction)
      }
    })
    .sort((a, b) => b.time - a.time)

  logTable(times)
  logSummary(times)
}

function executeInstruction (opcode: number, instruction: BaseInstruction): number {
  const start = Date.now()

  for (let i = 0; i < INS_TO_EXECUTE; i++) {
    instruction.execute(opcode, 0x00)
  }
  return Date.now() - start
}

function logTable (times: InstructionTime[]): void {
  console.log(`\nExecution Times - ${INS_TO_EXECUTE} times per instruction:\n`)
  times.forEach(result => {
    const instruction = `${result.name} (${result.addrMode})`.padEnd(22, ' ')
    console.log(`${instruction}\t${result.time} ms.`)
  })
}

function logSummary (times: Array<{ opcode: number, time: number }>): void {
  console.log(`\nSummary: ${times.reduce((accu, current) => accu + current.time, 0)} ms.`)
}
