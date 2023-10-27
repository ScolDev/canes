
import InstructionsTable from './instructions/instructions-table'

export const Instructions = (cpu, cpuALU) => {
  const decodeAndExecute = (instruction) => {
    const [opcode, operand] = instruction
    const decodedInstruction = instructionsTable[opcode]

    decodedInstruction.execute(opcode, operand)
  }

  const execute = (instruction) => {
    decodeAndExecute(instruction)
  }

  const cpuInstructions = {
    execute
  }

  const instructionsTable = InstructionsTable(cpu, cpuALU)

  return cpuInstructions
}
