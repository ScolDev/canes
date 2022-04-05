
import CPU_FLAGS from './cpu-consts/cpu-flags'
import And from './cpu-instructions/and'
import Adc from './cpu-instructions/adc'
import Asl from './cpu-instructions/asl'
import Bcc from './cpu-instructions/bcc'
import Bcs from './cpu-instructions/bcs'
import Beq from './cpu-instructions/beq'

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

  const updateOverflowFlag = (result, operandA, operandB) => {
    const operandABit7 = operandA >> 7
    const operandBBit7 = operandB >> 7
    const resultBit7 = (result & 0xff) >> 7

    if ((operandABit7 === operandBBit7) && (resultBit7 !== operandABit7)) {
      cpuALU.setFlag(CPU_FLAGS.OverflowFlag)
    }
  }

  const updateNegativeFlag = (result) => {
    if (cpuALU.getBitValue(0x07, result) === 0x01) {
      cpuALU.setFlag(CPU_FLAGS.NegativeFlag)
    }
  }

  const decodeAndExecute = (instruction) => {
    const [opcode, operand] = instruction
    const decodedInstruction = InstructionsTable[opcode]

    decodedInstruction.execute(opcode, operand)
  }

  const execute = (instruction) => {
    decodeAndExecute(instruction)
  }

  const cpuInstructions = {
    updateCarryFlag,
    updateZeroFlag,
    updateOverflowFlag,
    updateNegativeFlag,
    execute
  }

  const and = And(cpu, cpuALU, cpuInstructions)
  const adc = Adc(cpu, cpuALU, cpuInstructions)
  const asl = Asl(cpu, cpuALU, cpuInstructions)
  const bcc = Bcc(cpu, cpuALU, cpuInstructions)
  const bcs = Bcs(cpu, cpuALU, cpuInstructions)
  const beq = Beq(cpu, cpuALU, cpuInstructions)

  const InstructionsTable = {
    0x29: and,
    0x25: and,
    0x35: and,
    0x2d: and,
    0x3d: and,
    0x39: and,
    0x21: and,
    0x31: and,
    0x69: adc,
    0x65: adc,
    0x75: adc,
    0x6d: adc,
    0x7d: adc,
    0x79: adc,
    0x61: adc,
    0x71: adc,
    0x0a: asl,
    0x06: asl,
    0x16: asl,
    0x0e: asl,
    0x1e: asl,
    0x90: bcc,
    0xb0: bcs,
    0xf0: beq
  }

  return cpuInstructions
}
