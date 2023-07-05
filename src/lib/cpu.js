import CpuAddressingModes from './cpu-addressing-modes'
import CpuInstructions from './cpu-instructions'

import CPU_ADDRESSING_MODES from './cpu-consts/cpu-addressing-modes'
import CPU_REGISTERS from './cpu-consts/cpu-registers'
import CPU_DATA_SIZE from './cpu-consts/cpu-data-size'
import CPU_ALU from './cpu-alu'

export default (instructions) => {
  const MEM = Array(0xffff).fill(0x00)
  const REG = {
    PC: 0x0000,
    SP: 0xff,
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    P: 0x00
  }

  const setRegister = (register, value) => {
    if (register === CPU_REGISTERS.PC) {
      REG.PC = value & 0xffff
    } else {
      REG[register] = value & 0xff
    }
  }

  const getAddressFromAddressingMode = (addressingMode, operand) => {
    if (addressingMode === CPU_ADDRESSING_MODES.Absolute) {
      return operand
    }

    return getMemoryValueFromAddressingMode(addressingMode, operand)
  }

  const getMemoryValueFromAddressingMode = (addressingMode, operand) => {
    return AddressingModes.get(addressingMode, operand)
  }

  const setMemoryValueFromAddressingMode = (addressingMode, value, operand) => {
    AddressingModes.set(addressingMode, value, operand)
  }

  const getMemoryValue = (memoryAddress, dataSize = CPU_DATA_SIZE.Byte) => {
    memoryAddress &= 0xffff

    if (dataSize === CPU_DATA_SIZE.Byte) {
      return MEM[memoryAddress]
    }

    return MEM[memoryAddress] + (MEM[memoryAddress + 1] << 8)
  }

  const setMemoryValue = (memoryAddress, memoryValue, dataSize = CPU_DATA_SIZE.Byte) => {
    memoryAddress &= 0xffff
    MEM[memoryAddress] = memoryValue & 0xff

    if (dataSize === CPU_DATA_SIZE.Word) {
      MEM[memoryAddress + 1] = (memoryValue & 0xff00) >> 8
    }
  }

  const execute = (instruction) => {
    Instructions.execute(instruction)
  }

  const cpuApi = {
    MEM,
    REG,
    execute,
    getMemoryValue,
    getAddressFromAddressingMode,
    getMemoryValueFromAddressingMode,
    setRegister,
    setMemoryValue,
    setMemoryValueFromAddressingMode
  }

  const cpuALU = CPU_ALU(cpuApi)
  const Instructions = CpuInstructions(cpuApi, cpuALU)
  const AddressingModes = CpuAddressingModes(cpuApi, cpuALU)

  return cpuApi
}
