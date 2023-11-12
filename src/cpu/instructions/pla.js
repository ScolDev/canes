import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x68: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = cpu.load(stackMemoryAddress)

    cpu.setRegister(CPU_REGISTERS.A, memoryValue)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP + 1)

    updateStatus(memoryValue)
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (result) => {
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `pla${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
