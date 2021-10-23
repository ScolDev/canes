import CPU_MEMORY_MAP from './cpu-consts/cpu-mempry-map'
import CPU_DATA_SIZE from './cpu-consts/cpu-data-size'
import CPU_ALU from './cpu-alu'

export default (cpu) => {
  const addressingModes = [
    acumulator,
    immediate,
    zeroPage,
    zeroPageX,
    zeroPageY,
    relative,
    aboslute,
    absoluteX,
    absoluteY,
    indirect,
    indexedIndirect,
    indirectIndexed
  ]

  function acumulator () {
    return cpu.REG.A
  }

  function immediate (operand) {
    return operand & 0xff
  }

  function zeroPage (operand) {
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
    return cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
  }

  function zeroPageX (operand) {
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.X + operand) & 0xff)
    return cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
  }

  function zeroPageY (operand) {
    const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.Y + operand) & 0xff)
    return cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
  }

  function relative (operand) {
    return CPU_ALU.signedByte(operand)
  }

  function aboslute (operand) {
    return operand & 0xffff
  }

  function absoluteX (operand) {
    return (operand + cpu.REG.X) & 0xff
  }

  function absoluteY (operand) {
    return (operand + cpu.REG.Y) & 0xff
  }

  function indirect (operand) {
    return cpu.getMemoryValue(operand, CPU_DATA_SIZE.Word)
  }

  function indexedIndirect (operand) {
    const zeroPageOffset = (operand + cpu.REG.X) & 0xff
    const memoryAddress = cpu.getMemoryValue(zeroPageOffset, CPU_DATA_SIZE.Byte) +
              cpu.getMemoryValue((zeroPageOffset + 1) & 0xff, CPU_DATA_SIZE.Byte) << 8
    return cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
  }

  function indirectIndexed (operand) {
    const memoryAddress = cpu.getMemoryValue(operand, CPU_DATA_SIZE.Byte) +
              cpu.getMemoryValue((operand + 1) & 0xff, CPU_DATA_SIZE.Byte) << 8
    return cpu.getMemoryValue(memoryAddress + cpu.REG.Y, CPU_DATA_SIZE.Byte)
  }

  const get = (addressingMode, operand) => {
    return addressingModes[addressingMode](operand)
  }

  return {
    get
  }
}
