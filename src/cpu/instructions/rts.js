import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu) => {
  const addressingModes = {
    0x60: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode, operand) => {
    const newStackPointer = cpu.getRegister(CPU_REGISTERS.SP) + 2
    const stackMemoryAddress = cpu.getRegister(CPU_REGISTERS.SP) + 0x100
    const loadedPC = cpu.loadWord(stackMemoryAddress + 1)
    const newPC = loadedPC + 1

    cpu.setRegister(CPU_REGISTERS.SP, newStackPointer)
    cpu.setPC(newPC)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `rts${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
