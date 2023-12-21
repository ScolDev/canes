import { InstructionsTable } from './instructions-table'
import {
  type CPUInstructionTable,
  type CPUInstruction,
  type InstructionsCpu,
  type NESInstructionModule
} from '../../types'
import { CPUInstructionSize } from '../../consts/instructions'

export class Instruction implements NESInstructionModule {
  private readonly cpu: InstructionsCpu
  private readonly instructionsTable: CPUInstructionTable

  private constructor (cpu: InstructionsCpu) {
    this.cpu = cpu
    this.instructionsTable = InstructionsTable(cpu)
  }

  execute (instruction: CPUInstruction): void {
    this.decodeAndExecute(instruction)
  }

  getInstructionSize (opcode: number): number {
    const instruction = this.instructionsTable[opcode]
    const addressingMode = instruction.AddressingModes[opcode]

    return CPUInstructionSize[addressingMode]
  }

  private decodeAndExecute (instruction: CPUInstruction): void {
    const [opcode, operand] = instruction
    const decodedInstruction = this.instructionsTable[opcode]

    decodedInstruction.execute(opcode, operand)
    this.cpu.setLastExecuted({
      opcode,
      asm: decodedInstruction.getASM(instruction)
    })
  }

  static create (cpu: InstructionsCpu): NESInstructionModule {
    return new Instruction(cpu)
  }
}
