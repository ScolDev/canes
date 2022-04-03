import CPU_MEMORY_MAP from './cpu-consts/cpu-mempry-map'
import CPU_DATA_SIZE from './cpu-consts/cpu-data-size'

export default (cpu, cpuALU) => {
  const acumulator = {
    get: () => cpu.REG.A,
    set: (value, operand) => (cpu.REG.A = value)
  }

  const immediate = {
    get: (operand) => (operand & 0xff)
  }

  const zeroPage = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
      return cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
      cpu.putMemoryValue(memoryAddress, value)
    }
  }

  const zeroPageX = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.X + operand) & 0xff)
      return cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.X + operand) & 0xff)
      return cpu.putMemoryValue(memoryAddress, value)
    }
  }

  const zeroPageY = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.Y + operand) & 0xff)
      return cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
    }
  }

  const relative = {
    get: (operand) => cpuALU.getSignedByte(operand)
  }

  const aboslute = {
    get: (operand) => cpu.getMemoryValue(operand & 0xffff),
    set: (value, operand) => cpu.putMemoryValue(operand & 0xffff, value)
  }

  const absoluteX = {
    get: (operand) => cpu.getMemoryValue((operand + cpu.REG.X) & 0xffff),
    set: (value, operand) => cpu.putMemoryValue((operand + cpu.REG.X) & 0xffff, value)
  }

  const absoluteY = {
    get: (operand) => cpu.getMemoryValue((operand + cpu.REG.Y) & 0xffff)
  }

  const indirect = {
    get: (operand) => cpu.getMemoryValue(operand, CPU_DATA_SIZE.Word)
  }

  const indexedIndirect = {
    get: (operand) => {
      const zeroPageOffset = (operand + cpu.REG.X) & 0xff

      const memoryAddress = cpu.getMemoryValue(zeroPageOffset, CPU_DATA_SIZE.Byte) +
                  (cpu.getMemoryValue((zeroPageOffset + 1) & 0xff, CPU_DATA_SIZE.Byte) << 8)

      return cpu.getMemoryValue(memoryAddress, CPU_DATA_SIZE.Byte)
    }
  }

  const indirectIndexed = {
    get: (operand) => {
      const memoryAddress = cpu.getMemoryValue(operand, CPU_DATA_SIZE.Byte) +
                  (cpu.getMemoryValue((operand + 1) & 0xff, CPU_DATA_SIZE.Byte) << 8)
      return cpu.getMemoryValue(memoryAddress + cpu.REG.Y, CPU_DATA_SIZE.Byte)
    }
  }

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

  const get = (addressingMode, operand) => {
    return addressingModes[addressingMode].get(operand)
  }

  const set = (addressingMode, value, operand) => {
    return addressingModes[addressingMode].set(value, operand)
  }

  return {
    get,
    set
  }
}
