import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xba: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]
    const stackPointer = cpu.getRegister(CPU_REGISTERS.SP)

    cpu.setRegister(CPU_REGISTERS.X, stackPointer)
    updateStatus(cpu.getRegister(CPU_REGISTERS.X))
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (result) => {
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `tsx${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
