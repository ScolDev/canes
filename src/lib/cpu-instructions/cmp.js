import CPU_FLAGS from '../cpu-consts/cpu-flags'
import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'

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
    const accumulator = cpu.REG.A
    const memoryValue = cpu.getMemoryValueFromAddressingMode(addressingMode, operand)

    const result = 0x100 + accumulator - memoryValue

    updateStatus(result, accumulator, memoryValue)
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
