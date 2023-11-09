
import InstructionsTable from './instructions/instructions-table'

export const Instructions = (cpu, cpuALU) => {
  const execute = (instruction) => {
    decodeAndExecute(instruction)
  }

  const decodeAndExecute = (instruction) => {
    const [opcode, operand] = instruction
    const decodedInstruction = instructionsTable[opcode]

    decodedInstruction.execute(opcode, operand)
  }

  const cpuInstructions = {
    execute
  }

  const instructionsTable = InstructionsTable(cpu, cpuALU)

  return cpuInstructions
}
