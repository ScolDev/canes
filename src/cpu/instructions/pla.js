import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x08: CPU_ADDRESSING_MODES.Implied
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

  return {
    execute
  }
}
