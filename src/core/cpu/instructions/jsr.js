import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu) => {
  const addressingModes = {
    0x20: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const addressValue = cpu.loadAddressByAddressingMode(addressingMode, operand)
    const currentPC = cpu.getRegister(CPU_REGISTERS.PC)
    const newStackPointer = cpu.getRegister(CPU_REGISTERS.SP) - 2
    const stackMemoryAddress = (cpu.getRegister(CPU_REGISTERS.SP) - 1) + 0x100

    cpu.setRegister(CPU_REGISTERS.SP, newStackPointer)
    cpu.storeWord(stackMemoryAddress, currentPC + 2)
    cpu.setPC(addressValue)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `jsr${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
