import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x4a: CPU_ADDRESSING_MODES.Acumulator,
    0x46: CPU_ADDRESSING_MODES.ZeroPage,
    0x56: CPU_ADDRESSING_MODES.ZeroPageX,
    0x4e: CPU_ADDRESSING_MODES.Absolute,
    0x5e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const operandValue = cpu.loadByAddressingMode(addressingMode, operand)
    const result = (operandValue >> 1) & 0xff

    cpu.storeByAddressingMode(addressingMode, result, operand)
    updateStatus(result, operandValue)
  }

  const updateStatus = (result, operandValue) => {
    const carryFlag = cpuALU.getBitValue(0, operandValue)

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
