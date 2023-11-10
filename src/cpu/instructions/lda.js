import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xa9: CPU_ADDRESSING_MODES.Immediate,
    0xa5: CPU_ADDRESSING_MODES.ZeroPage,
    0xb5: CPU_ADDRESSING_MODES.ZeroPageX,
    0xad: CPU_ADDRESSING_MODES.Absolute,
    0xbd: CPU_ADDRESSING_MODES.AbsoluteX,
    0xb9: CPU_ADDRESSING_MODES.AbsoluteY,
    0xa1: CPU_ADDRESSING_MODES.IndexedIndirect,
    0xb1: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)

    cpu.setRegister(CPU_REGISTERS.A, memoryValue)
    updateStatus(cpu.getRegister(CPU_REGISTERS.A))
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (accumulator) => {
    cpuALU.updateZeroFlag(accumulator)
    cpuALU.updateNegativeFlag(accumulator)
  }

  return {
    execute
  }
}
