import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x2a: CPU_ADDRESSING_MODES.Acumulator,
    0x26: CPU_ADDRESSING_MODES.ZeroPage,
    0x36: CPU_ADDRESSING_MODES.ZeroPageX,
    0x2e: CPU_ADDRESSING_MODES.Absolute,
    0x3e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const operandValue = cpu.loadByAddressingMode(addressingMode, operand)
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)

    const result = ((operandValue << 1) + carryFlag) & 0xff

    cpu.storeByAddressingMode(addressingMode, result, operand)
    updateStatus(result, operandValue)
  }

  const updateStatus = (result, operandValue) => {
    const carryFlag = cpuALU.getBitValue(7, operandValue)

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
