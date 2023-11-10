import { CPU_FLAGS } from '../consts/flags'
import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xc9: CPU_ADDRESSING_MODES.Immediate,
    0xc5: CPU_ADDRESSING_MODES.ZeroPage,
    0xd5: CPU_ADDRESSING_MODES.ZeroPageX,
    0xcd: CPU_ADDRESSING_MODES.Absolute,
    0xdd: CPU_ADDRESSING_MODES.AbsoluteX,
    0xd9: CPU_ADDRESSING_MODES.AbsoluteY,
    0xc1: CPU_ADDRESSING_MODES.IndexedIndirect,
    0xd1: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const accumulator = cpu.getRegister(CPU_REGISTERS.A)
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)

    const result = 0x100 + accumulator - memoryValue

    updateStatus(result, accumulator, memoryValue)
    cpu.nextPC(addressingMode)
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
