import CPU_FLAGS from './cpu-flags'
import CPU_REGISTERS from './cpu-registers'
import CPU_ADDRESSING_MODES from './cpu-addressing-modes'
import CPU_MEMORY_MAP from './cpu-mempry-map'
import CPU_ALU from './cpu-alu'

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
      return MEM[CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)]
    } else if (addressingMode === CPU_ADDRESSING_MODES.ZeroPageX) {
      return MEM[CPU_MEMORY_MAP.ZeroPage + ((REG.X + operand) & 0xff)]
    } else if (addressingMode === CPU_ADDRESSING_MODES.ZeroPageY) {
      return MEM[CPU_MEMORY_MAP.ZeroPage + ((REG.Y + operand) & 0xff)]
    } else if (addressingMode === CPU_ADDRESSING_MODES.Relative) {
      return CPU_ALU.signedByte(operand)
    } else if (addressingMode === CPU_ADDRESSING_MODES.Absolute) {
      return operand & 0xffff
    } else if (addressingMode === CPU_ADDRESSING_MODES.AbsoluteX) {
      return (operand + REG.X) & 0xffff
    }
  }

  const putMemoryValue = (memoryAddress, memoryValue) => {
    memoryAddress &= 0xffff
    MEM[memoryAddress] = memoryValue & 0xff
  }

  return {
    MEM,
    REG,
    getFlag,
    getValue,
    setRegister,
    putMemoryValue
  }
}
