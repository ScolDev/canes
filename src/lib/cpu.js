import CPU_REGISTERS from './cpu-consts/cpu-registers'
import CPU_ADDRESSING_MODES from './cpu-consts/cpu-addressing-modes'
import CPU_MEMORY_MAP from './cpu-consts/cpu-mempry-map'
import CPU_DATA_SIZE from './cpu-consts/cpu-data-size'
import CPU_ALU from './cpu-alu'
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
    let memoryAddress = 0x0
    let zeroPageOffset = 0x0

    switch (addressingMode) {
      case CPU_ADDRESSING_MODES.Acumulator:
        return REG.A
      case CPU_ADDRESSING_MODES.Immediate:
        return operand & 0xff
      case CPU_ADDRESSING_MODES.ZeroPage:
        memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
        return getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
      case CPU_ADDRESSING_MODES.ZeroPageX:
        memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((REG.X + operand) & 0xff)
        return getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
      case CPU_ADDRESSING_MODES.ZeroPageY:
        memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((REG.Y + operand) & 0xff)
        return getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
      case CPU_ADDRESSING_MODES.Relative:
        return CPU_ALU.signedByte(operand)
      case CPU_ADDRESSING_MODES.Absolute:
        return operand & 0xffff
      case CPU_ADDRESSING_MODES.AbsoluteX:
        return (operand + REG.X) & 0xff
      case CPU_ADDRESSING_MODES.AbsoluteY:
        return (operand + REG.Y) & 0xff
      case CPU_ADDRESSING_MODES.Indirect:
        return getMemoryValue(operand, CPU_DATA_SIZE.Word)
      case CPU_ADDRESSING_MODES.IndexedIndirect:
        zeroPageOffset = (operand + REG.X) & 0xff
        memoryAddress = getMemoryValue(zeroPageOffset, CPU_DATA_SIZE.Byte) +
                    getMemoryValue((zeroPageOffset + 1) & 0xff, CPU_DATA_SIZE.Byte) << 8
        return getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
      case CPU_ADDRESSING_MODES.IndirectIndexed:
        memoryAddress = getMemoryValue(operand, CPU_DATA_SIZE.Byte) +
                    getMemoryValue((operand + 1) & 0xff, CPU_DATA_SIZE.Byte) << 8
        return getMemoryValue(memoryAddress + REG.Y, CPU_DATA_SIZE.Byte)
    }
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
    _instructions.execute(instruction)
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

  const _instructions = CPU_INSTRUCTIONS(CPU_API)

  return CPU_API
}
