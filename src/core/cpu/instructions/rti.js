import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu) => {
  const addressingModes = {
    0x40: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode, operand) => {
    const currentSP = cpu.getRegister(CPU_REGISTERS.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const processorStatus = cpu.load(stackMemoryAddress)
    const pc = cpu.loadWord(stackMemoryAddress + 1)

    cpu.setRegister(CPU_REGISTERS.P, processorStatus)
    cpu.setRegister(CPU_REGISTERS.SP, currentSP + 2)
    cpu.setPC(pc)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `rti${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
