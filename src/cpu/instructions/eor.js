import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x49: CPU_ADDRESSING_MODES.Immediate,
    0x45: CPU_ADDRESSING_MODES.ZeroPage,
    0x55: CPU_ADDRESSING_MODES.ZeroPageX,
    0x4d: CPU_ADDRESSING_MODES.Absolute,
    0x5d: CPU_ADDRESSING_MODES.AbsoluteX,
    0x59: CPU_ADDRESSING_MODES.AbsoluteY,
    0x41: CPU_ADDRESSING_MODES.IndexedIndirect,
    0x51: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]

    const acumulatorValue = cpu.REG.A
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)
    const resultValue = (acumulatorValue ^ memoryValue) & 0xff

    cpu.setRegister(CPU_REGISTERS.A, resultValue)
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
