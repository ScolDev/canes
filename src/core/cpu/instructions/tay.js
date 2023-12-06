import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xa8: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]
    const currentAccumulator = cpu.getRegister(CPU_REGISTERS.A)

    cpu.setRegister(CPU_REGISTERS.Y, currentAccumulator)
    updateStatus(cpu.getRegister(CPU_REGISTERS.Y))
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (result) => {
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `tay${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
