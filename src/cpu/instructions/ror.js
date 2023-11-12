import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x6a: CPU_ADDRESSING_MODES.Acumulator,
    0x66: CPU_ADDRESSING_MODES.ZeroPage,
    0x76: CPU_ADDRESSING_MODES.ZeroPageX,
    0x6e: CPU_ADDRESSING_MODES.Absolute,
    0x7e: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const operandValue = cpu.loadByAddressingMode(addressingMode, operand)
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)

    const result = (operandValue >> 1) + (carryFlag << 7)

    cpu.storeByAddressingMode(addressingMode, result, operand)
    updateStatus(result, operandValue)
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (result, operandValue) => {
    const carryFlag = cpuALU.getBitValue(0, operandValue)

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `ror${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
