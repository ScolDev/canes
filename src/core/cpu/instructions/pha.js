import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const addressingModes = {
    0x48: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]
    const accumulator = cpu.getRegister(CPU_REGISTERS.A)
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)

    const stackMemoryAddress = 0x100 + currentSP

    cpu.store(stackMemoryAddress, accumulator)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP - 1)
    cpu.nextPC(addressingMode)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `pha${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
