import { InstructionsTable } from './instructions-table'
import {
  type CPUInstructionTable,
  type CPUInstruction,
  type InstructionsCpu,
  type NESInstructionComponent,
  type LastExecutedInstruction
} from '../../types'
import { CPUInstructionSize } from '../../consts/instructions'
import { InstructionsCPUCyclesTable } from './consts/instructions-cycles'

export class Instruction implements NESInstructionComponent {
  private readonly InstructionsCyclesTable = InstructionsCPUCyclesTable
  private readonly instructionsTable: CPUInstructionTable
  private lastExecuted: LastExecutedInstruction

  private constructor (cpu: InstructionsCpu) {
    this.instructionsTable = InstructionsTable(cpu)
  }

  execute (instruction: CPUInstruction): void {
    this.decodeAndExecute(instruction)
  }

  getInstructionCycles (instruction: CPUInstruction): number {
    const opcode = instruction[0]
    return this.InstructionsCyclesTable[opcode]
  }

  getInstructionSize (opcode: number): number {
    const instruction = this.instructionsTable[opcode]
    const addressingMode = instruction.AddressingModes[opcode]

    return CPUInstructionSize[addressingMode]
  }

  getLastExecuted (): LastExecutedInstruction {
    return this.lastExecuted
  }

  private decodeAndExecute (instruction: CPUInstruction): void {
    const [opcode, operand] = instruction
    const decodedInstruction = this.instructionsTable[opcode]

    decodedInstruction.execute(opcode, operand)
    this.lastExecuted = {
      bytes: instruction,
      module: decodedInstruction
    }
  }

  static create (cpu: InstructionsCpu): NESInstructionComponent {
    return new Instruction(cpu)
  }
}
