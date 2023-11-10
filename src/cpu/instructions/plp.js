import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const addressingModes = {
    0x28: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = cpu.load(stackMemoryAddress)

    cpu.setRegister(CPU_REGISTERS.P, memoryValue)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP + 1)
    cpu.nextPC(addressingMode)
  }

  return {
    execute
  }
}
