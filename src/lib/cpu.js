import CPU_FLAGS from './cpu-flags'
import CPU_REGISTERS from './cpu-registers'
import CPU_ADDRESSING_MODES from './cpu-addressing-modes'
import CPU_MEMORY_MAP from './cpu-mempry-map'

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
