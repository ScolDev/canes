import CPU_FLAGS from './cpu-consts/cpu-flags'
import CPU_REGISTERS from './cpu-consts/cpu-registers'
import CPU_ADDRESSING_MODES from './cpu-consts/cpu-addressing-modes'

export default (cpu) => {
  const opcodesAND = [0x29, 0x25, 0x35, 0x2d, 0x3d, 0x39, 0x21, 0x31]
  const opcodesADC = [0x69]

  const addressingModesAND = {
    0x29: CPU_ADDRESSING_MODES.Immediate,
    0x25: CPU_ADDRESSING_MODES.ZeroPage,
    0x35: CPU_ADDRESSING_MODES.ZeroPageX,
    0x2d: CPU_ADDRESSING_MODES.Absolute,
    0x3d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x39: CPU_ADDRESSING_MODES.AbsoluteY,
    0x21: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x31: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const addressingModesADC = {
    0x69: CPU_ADDRESSING_MODES.Immediate
  }

  const executeAND = (opcode, operand) => {
    const addressingMode = addressingModesAND[opcode]
    cpu.REG.A = cpu.REG.A & cpu.getMemoryValueFromAddressingMode(addressingMode, operand)

    updateStatusForAND(cpu.REG.A)
    return cpu.REG.A
  }

  const executeADC = (opcode, operand) => {
    const addressingMode = addressingModesADC[opcode]
    const carryFlag = cpu.getFlag(CPU_FLAGS.CarryFlag)
    const operandB = cpu.REG.A

    const result = cpu.REG.A + cpu.getMemoryValueFromAddressingMode(addressingMode, operand) + carryFlag
    cpu.REG.A = result & 0xff

    updateStatusForADC(result, operand, operandB)
    return cpu.REG.A
  }

  const updateStatusForADC = (result, operandA, operandB) => {
    updateCarryFlag(result)
    updateZeroFlag(result)
    updateNegativeFlag(result)
    updateOverflowFlag(result, operandA, operandB)
  }

  const updateStatusForAND = (result) => {
    updateZeroFlag(result)
    updateNegativeFlag(result)
  }

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
    if (cpu.getBitValue(0x07, result) === 0x01) {
      cpu.REG.P = cpu.REG.P | 0b10000000
    }
  }

  const decodeAndExecute = (instruction) => {
    const [opcode, operand] = instruction

    if (opcodesAND.includes(opcode)) {
      return executeAND(opcode, operand)
    }
    if (opcodesADC.includes(opcode)) {
      return executeADC(opcode, operand)
    }
  }

  const execute = (instruction) => {
    decodeAndExecute(instruction)
  }

  return {
    execute
  }
}
