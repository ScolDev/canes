
import CPU_FLAGS from './cpu-consts/cpu-flags'
import InstructionsTable from './cpu-instructions/instructions-table'

export default (cpu, cpuALU) => {
  const updateCarryFlag = (result) => {
    if (result > 0xff) {
      cpuALU.setFlag(CPU_FLAGS.CarryFlag)
    }
  }

  const updateZeroFlag = (result) => {
    if ((result & 0xff) === 0x00) {
      cpuALU.setFlag(CPU_FLAGS.ZeroFlag)
    }
  }

  const updateNegativeFlag = (result) => {
    if (cpuALU.getBitValue(0x07, result) === 0x01) {
      cpuALU.setFlag(CPU_FLAGS.NegativeFlag)
    }
  }

  const decodeAndExecute = (instruction) => {
    const [opcode, operand] = instruction
    const decodedInstruction = instructionsTable[opcode]

    decodedInstruction.execute(opcode, operand)
  }

  const execute = (instruction) => {
    decodeAndExecute(instruction)
  }

  const cpuInstructions = {
    updateCarryFlag,
    updateZeroFlag,
    updateNegativeFlag,
    execute
  }

  const instructionsTable = InstructionsTable(cpu, cpuALU, cpuInstructions)

  return cpuInstructions
}
