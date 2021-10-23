import CPU_REGISTERS from './cpu-consts/cpu-registers'
import CPU_ADDRESSING_MODES from './cpu-addressing-modes'
import CPU_DATA_SIZE from './cpu-consts/cpu-data-size'
import CPU_INSTRUCTIONS from './cpu-instructions'

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

  const getFlag = (flag) => {
    return getBitValue(flag, REG.P)
  }

  const getBitValue = (bit, register) => {
    return (register & (2 ** bit)) >> bit
  }

  const setRegister = (register, value) => {
    if (register === CPU_REGISTERS.PC) {
      REG.PC = value & 0xffff
    } else {
      REG[register] = value & 0xff
    }
  }

  const getMemoryValueFromAddressingMode = (addressingMode, operand) => {
    return AddressingModes.get(addressingMode, operand)
  }

  const getMemoryValue = (memoryAddress, dataSize) => {
    memoryAddress &= 0xffff

    if (dataSize === CPU_DATA_SIZE.Byte) {
      return MEM[memoryAddress]
    }

    return MEM[memoryAddress] + (MEM[memoryAddress + 1] << 8)
  }

  const putMemoryValue = (memoryAddress, memoryValue, dataSize) => {
    memoryAddress &= 0xffff
    MEM[memoryAddress] = memoryValue & 0xff

    if (dataSize === CPU_DATA_SIZE.Word) {
      MEM[memoryAddress + 1] = (memoryValue & 0xff00) >> 8
    }
  }

  const execute = (instruction) => {
    Instructions.execute(instruction)
  }

  const CPU_API = {
    MEM,
    REG,
    execute,
    getFlag,
    getBitValue,
    setRegister,
    getMemoryValue,
    putMemoryValue,
    getMemoryValueFromAddressingMode
  }

  const Instructions = CPU_INSTRUCTIONS(CPU_API)
  const AddressingModes = CPU_ADDRESSING_MODES(CPU_API)

  return CPU_API
}
