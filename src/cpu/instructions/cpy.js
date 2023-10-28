import { CPU_FLAGS } from '../consts/flags'
import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xc0: CPU_ADDRESSING_MODES.Immediate,
    0xc4: CPU_ADDRESSING_MODES.ZeroPage,
    0xcc: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const registerValue = cpu.getRegister(CPU_REGISTERS.Y)
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)

    const result = 0x100 + registerValue - memoryValue

    updateStatus(result, registerValue, memoryValue)
  }

  const updateStatus = (result, operandA, operandB) => {
    const carryFlag = operandA >= operandB ? 1 : 0

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  return {
    execute
  }
}
