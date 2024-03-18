import type ControlBus from '../control-bus/control-bus'
import { InstructionsCPUCyclesTable } from './consts/instruction-cycle'
import { CPUInstructionSize } from './consts/instruction-size'
import { UnknownInstruction } from './errors/unknown-instruction'
import { InstructionsTable } from './instructions-table'
import {
  type NESInstructionComponent,
  type CPUInstructionTable,
  type CPUInstruction
} from './types'

export class Instruction implements NESInstructionComponent {
  private readonly InstructionsCyclesTable = InstructionsCPUCyclesTable
  private readonly instructionsTable: CPUInstructionTable

  private constructor (readonly control: ControlBus) {
    this.instructionsTable = InstructionsTable(control)
  }

  execute (instruction: CPUInstruction): void {
    this.decodeAndExecute(instruction)
  }

  fetchInstructionBytes (fromAddress: number): CPUInstruction {
    const opcode = this.control.memory.load(fromAddress)
    const instruction: CPUInstruction = [opcode]
    const instructionSize = this.getInstructionSize(opcode)

    if (instructionSize === 0x02) {
      instruction[1] = this.control.memory.load(fromAddress + 1)
    } else if (instructionSize === 0x03) {
      instruction[1] = this.control.memory.loadWord(fromAddress + 1)
    }

    return instruction
  }

  getInstructionCycles (instruction: CPUInstruction): number {
    const opcode = instruction[0]
    return this.InstructionsCyclesTable[opcode]
  }

  getInstructionSize (opcode: number): number {
    const instruction = this.instructionsTable[opcode]

    if (instruction === undefined) {
      throw new UnknownInstruction(opcode)
    }

    const addressingMode = instruction.AddressingModes[opcode]

    return CPUInstructionSize[addressingMode]
  }

  private decodeAndExecute (instruction: CPUInstruction): void {
    const [opcode, operand] = instruction
    const decodedInstruction = this.instructionsTable[opcode]

    if (decodedInstruction === undefined) {
      throw new UnknownInstruction(opcode)
    }

    decodedInstruction.execute(opcode, operand)
  }

  static create (control: ControlBus): NESInstructionComponent {
    return new Instruction(control)
  }
}
