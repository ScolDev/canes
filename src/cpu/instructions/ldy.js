import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xa0: CPU_ADDRESSING_MODES.Immediate,
    0xa4: CPU_ADDRESSING_MODES.ZeroPage,
    0xb4: CPU_ADDRESSING_MODES.ZeroPageX,
    0xac: CPU_ADDRESSING_MODES.Absolute,
    0xbc: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)

    cpu.setRegister(CPU_REGISTERS.Y, memoryValue)
    updateStatus(cpu.REG.Y)
  }

  const updateStatus = (accumulator) => {
    cpuALU.updateZeroFlag(accumulator)
    cpuALU.updateNegativeFlag(accumulator)
  }

  return {
    execute
  }
}
