import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xc6: CPU_ADDRESSING_MODES.ZeroPage,
    0xd6: CPU_ADDRESSING_MODES.ZeroPageX,
    0xce: CPU_ADDRESSING_MODES.Absolute,
    0xde: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)
    const resultValue = (memoryValue - 1) & 0xff

    cpu.storeByAddressingMode(addressingMode, resultValue, operand)
    updateStatus(resultValue)
  }

  const updateStatus = (result) => {
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
