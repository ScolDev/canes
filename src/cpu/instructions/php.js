import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const addressingModes = {
    0x08: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]
    const processorStatus = cpu.getRegister(CPU_REGISTERS.P)
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)

    const stackMemoryAddress = 0x100 + currentSP

    cpu.store(stackMemoryAddress, processorStatus)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP - 1)
    cpu.nextPC(addressingMode)
  }

  return {
    execute
  }
}
