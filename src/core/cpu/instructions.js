import { AddressingModeSize } from './consts/addressing-modes'
import InstructionsTable from './instructions/instructions-table'

export class Instructions {
  #cpu = null
  #cpuALU = null
  #instructionsTable = null
  #context = {
    lastExecuted: {
      opcode: 0x00,
      asm: ''
    }
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
    this.#instructionsTable = InstructionsTable(this.#cpu, this.#cpuALU)
  }

  execute = (instruction) => {
    this.#decodeAndExecute(instruction)
  }

  getLastExecuted () {
    return this.#context.lastExecuted
  }

  getInstructionSize (opcode) {
    const instruction = this.#instructionsTable[opcode]
    const addressingMode = instruction.addressingModes[opcode]

    return AddressingModeSize.get(addressingMode)
  }

  #decodeAndExecute (instruction) {
    const [opcode, operand] = instruction
    const decodedInstruction = this.#instructionsTable[opcode]

    decodedInstruction.execute(opcode, operand)
    this.#context.lastExecuted = {
      opcode,
      asm: decodedInstruction.getASM(instruction)
    }
  }
}
