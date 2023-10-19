import CPU_MEMORY_MAP from './cpu-consts/cpu-memory-map'
import CPU_DATA_SIZE from './cpu-consts/cpu-data-size'
import CPU_REGISTERS from './cpu-consts/cpu-registers'

export default (cpu, cpuALU) => {
  const acumulator = {
    get: () => cpu.REG.A,
    set: (value, operand) => (cpu.setRegister(CPU_REGISTERS.A, value))
  }

  const immediate = {
    get: (operand) => (operand & 0xff)
  }

  const zeroPage = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
      return cpu.getMemoryValue(memoryAddress)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
      cpu.setMemoryValue(memoryAddress, value)
    }
  }

  const zeroPageX = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.X + operand) & 0xff)
      return cpu.getMemoryValue(memoryAddress)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.X + operand) & 0xff)
      return cpu.setMemoryValue(memoryAddress, value)
    }
  }

  const zeroPageY = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.Y + operand) & 0xff)
      return cpu.getMemoryValue(memoryAddress)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.REG.Y + operand) & 0xff)
      return cpu.setMemoryValue(memoryAddress, value)
    }
  }

  const relative = {
    get: (operand) => cpuALU.getSignedByte(operand)
  }

  const aboslute = {
    get: (operand) => cpu.getMemoryValue(operand),
    set: (value, operand) => cpu.setMemoryValue(operand, value)
  }

  const absoluteX = {
    get: (operand) => cpu.getMemoryValue((operand + cpu.REG.X)),
    set: (value, operand) => cpu.setMemoryValue((operand + cpu.REG.X), value)
  }

  const absoluteY = {
    get: (operand) => cpu.getMemoryValue((operand + cpu.REG.Y)),
    set: (value, operand) => cpu.setMemoryValue((operand + cpu.REG.Y), value)
  }

  const indirect = {
    get: (operand) => cpu.getMemoryValue(operand, CPU_DATA_SIZE.Word)
  }

  const indexedIndirect = {
    get: (operand) => {
      const zeroPageOffset = (operand + cpu.REG.X) & 0xff

      const memoryAddress = cpu.getMemoryValue(zeroPageOffset) +
                  (cpu.getMemoryValue((zeroPageOffset + 1) & 0xff) << 8)

      return cpu.getMemoryValue(memoryAddress)
    },
    set: (value, operand) => {
      const zeroPageOffset = (operand + cpu.REG.X) & 0xff

      const memoryAddress = cpu.getMemoryValue(zeroPageOffset) +
                  (cpu.getMemoryValue((zeroPageOffset + 1) & 0xff) << 8)

      cpu.setMemoryValue(memoryAddress, value)
    }
  }

  const indirectIndexed = {
    get: (operand) => {
      const memoryAddress = cpu.getMemoryValue(operand) +
                  (cpu.getMemoryValue((operand + 1) & 0xff) << 8)
      return cpu.getMemoryValue(memoryAddress + cpu.REG.Y)
    },
    set: (value, operand) => {
      const memoryAddress = cpu.getMemoryValue(operand) +
                  (cpu.getMemoryValue((operand + 1) & 0xff) << 8)
      cpu.setMemoryValue(memoryAddress + cpu.REG.Y, value)
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
