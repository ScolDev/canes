
import And from './cpu-instructions/and'
import Adc from './cpu-instructions/adc'

export default (cpu, cpuALU) => {
  const updateCarryFlag = (result) => {
    if (result > 0xff) {
      cpu.REG.P = cpu.REG.P | 0b00000001
    }
  }

  const updateZeroFlag = (result) => {
    if ((result & 0xff) === 0x00) {
      cpu.REG.P = cpu.REG.P | 0b00000010
    }
  }

  const updateOverflowFlag = (result, operandA, operandB) => {
    const operandABit7 = operandA >> 7
    const operandBBit7 = operandB >> 7
    const resultBit7 = (result & 0xff) >> 7

    if ((operandABit7 === operandBBit7) && (resultBit7 !== operandABit7)) {
      cpu.REG.P = cpu.REG.P | 0b01000000
    }
  }

  const updateNegativeFlag = (result) => {
    if (cpuALU.getBitValue(0x07, result) === 0x01) {
      cpu.REG.P = cpu.REG.P | 0b10000000
    }
  }

  const decodeAndExecute = (instruction) => {
    const [opcode, operand] = instruction

    if (_and.opcodes.includes(opcode)) {
      return _and.execute(opcode, operand)
    }
    if (_adc.opcodes.includes(opcode)) {
      return _adc.execute(opcode, operand)
    }
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

  const _and = And(cpu, cpuALU, cpuInstructions)
  const _adc = Adc(cpu, cpuALU, cpuInstructions)

  return cpuInstructions
}
