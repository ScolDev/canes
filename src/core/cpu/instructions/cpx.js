import { CPU_FLAGS } from '../consts/flags'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xe0: CPU_ADDRESSING_MODES.Immediate,
    0xe4: CPU_ADDRESSING_MODES.ZeroPage,
    0xec: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const registerValue = cpu.getRegister(CPU_REGISTERS.X)
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)

    const result = 0x100 + registerValue - memoryValue

    updateStatus(result, registerValue, memoryValue)
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (result, operandA, operandB) => {
    const carryFlag = operandA >= operandB ? 1 : 0

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `cpx${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
