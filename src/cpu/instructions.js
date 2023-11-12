
import { AddressingModeSize } from './consts/addressing-modes'
import InstructionsTable from './instructions/instructions-table'

export const Instructions = (cpu, cpuALU) => {
  const context = {
    lastExecuted: {
      opcode: 0x00,
      asm: ''
    }
  }

  const execute = (instruction) => {
    _decodeAndExecute(instruction)
  }

  const getLastExecuted = () => {
    return context.lastExecuted
  }

  const getInstructionSize = (opcode) => {
    const instruction = instructionsTable[opcode]
    const addressingMode = instruction.addressingModes[opcode]

    return AddressingModeSize.get(addressingMode)
  }

  const _decodeAndExecute = (instruction) => {
    const [opcode, operand] = instruction
    const decodedInstruction = instructionsTable[opcode]

    decodedInstruction.execute(opcode, operand)

    context.lastExecuted = {
      opcode,
      asm: decodedInstruction.getASM(instruction)
    }
  }

  const instructionsTable = InstructionsTable(cpu, cpuALU)

  return {
    execute,
    getLastExecuted,
    getInstructionSize
  }
}
