import CPU_REGISTERS from './cpu-registers'
import CPU_ADDRESSING_MODES from './cpu-addressing-modes'
import CPU_MEMORY_MAP from './cpu-mempry-map'
import CPU_ALU from './cpu-alu'
import CPU_DATA_SIZE from './cpu-data-size'

export default () => {
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
    return (REG.P & (2 ** flag)) >> flag
  }

  const setRegister = (register, value) => {
    if (register === CPU_REGISTERS.PC) {
      REG.PC = value & 0xffff
    } else {
      REG[register] = value & 0xff
    }
  }

  const getValue = (addressingMode, operand) => {
    if (addressingMode === CPU_ADDRESSING_MODES.Acumulator) {
      return REG.A
    } else if (addressingMode === CPU_ADDRESSING_MODES.Immediate) {
      return operand & 0xff
    } else if (addressingMode === CPU_ADDRESSING_MODES.ZeroPage) {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
      return getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
    } else if (addressingMode === CPU_ADDRESSING_MODES.ZeroPageX) {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((REG.X + operand) & 0xff)
      return getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
    } else if (addressingMode === CPU_ADDRESSING_MODES.ZeroPageY) {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((REG.Y + operand) & 0xff)
      return getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
    } else if (addressingMode === CPU_ADDRESSING_MODES.Relative) {
      return CPU_ALU.signedByte(operand)
    } else if (addressingMode === CPU_ADDRESSING_MODES.Absolute) {
      return operand & 0xffff
    } else if (addressingMode === CPU_ADDRESSING_MODES.AbsoluteX) {
      return (operand + REG.X) & 0xffff
    } else if (addressingMode === CPU_ADDRESSING_MODES.AbsoluteY) {
      return (operand + REG.Y) & 0xffff
    } else if (addressingMode === CPU_ADDRESSING_MODES.Indirect) {
      return getMemoryValue(operand, CPU_DATA_SIZE.Word)
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

  return {
    MEM,
    REG,
    getFlag,
    getValue,
    setRegister,
    getMemoryValue,
    putMemoryValue
  }
}
