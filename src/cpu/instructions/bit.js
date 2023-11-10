
import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x24: CPU_ADDRESSING_MODES.ZeroPage,
    0x2c: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)
    const result = cpu.getRegister(CPU_REGISTERS.A) & memoryValue

    updateStatus(result, memoryValue)
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (result, operand) => {
    const overflowFlag = cpuALU.getBitValue(6, operand)

    cpuALU.updateZeroFlag(result)
    cpuALU.setFlag(CPU_FLAGS.OverflowFlag, overflowFlag)
    cpuALU.updateNegativeFlag(operand)
  }

  return {
    execute
  }
}
