import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x0a: CPU_ADDRESSING_MODES.Acumulator,
    0x06: CPU_ADDRESSING_MODES.ZeroPage,
    0x16: CPU_ADDRESSING_MODES.ZeroPageX,
    0x0e: CPU_ADDRESSING_MODES.Absolute,
    0x1e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const operandValue = cpu.loadByAddressingMode(addressingMode, operand)
    const result = (operandValue << 1) & 0xff

    cpu.storeByAddressingMode(addressingMode, result, operand)
    updateStatus(result, operandValue)
    cpu.nextPC(addressingMode)
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
