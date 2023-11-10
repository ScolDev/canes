import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xa2: CPU_ADDRESSING_MODES.Immediate,
    0xa6: CPU_ADDRESSING_MODES.ZeroPage,
    0xb6: CPU_ADDRESSING_MODES.ZeroPageY,
    0xae: CPU_ADDRESSING_MODES.Absolute,
    0xbe: CPU_ADDRESSING_MODES.AbsoluteY
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)

    cpu.setRegister(CPU_REGISTERS.X, memoryValue)
    updateStatus(cpu.getRegister(CPU_REGISTERS.X))
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
