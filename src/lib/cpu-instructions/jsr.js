import CPU_ADDRESSING_MODES from '../cpu-consts/cpu-addressing-modes'
import CPU_REGISTERS from '../cpu-consts/cpu-registers'
import CPU_DATA_SIZE from '../cpu-consts/cpu-data-size'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x20: CPU_ADDRESSING_MODES.Absolute
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const addressValue = cpu.getAddressFromAddressingMode(addressingMode, operand)
    const currentPC = cpu.REG.PC
    const newStackPointer = cpu.REG.SP - 2
    const stackMemoryAddress = (cpu.REG.SP - 1) + 0x100

    cpu.setRegister(CPU_REGISTERS.PC, addressValue)
    cpu.setRegister(CPU_REGISTERS.SP, newStackPointer)
    cpu.setMemoryValue(stackMemoryAddress, currentPC + 2, CPU_DATA_SIZE.Word)
  }

  return {
    execute
  }
}
