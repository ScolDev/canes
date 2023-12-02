import { CPU_MEMORY_MAP } from './consts/memory-map'
import { CPU_REGISTERS } from './consts/registers'

export const AddressingModes = (cpu, cpuALU) => {
  const acumulator = {
    get: () => cpu.getRegister(CPU_REGISTERS.A),
    set: (value, operand) => (cpu.setRegister(CPU_REGISTERS.A, value))
  }

  const immediate = {
    get: (operand) => (operand & 0xff)
  }

  const zeroPage = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
      return cpu.load(memoryAddress)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
      cpu.store(memoryAddress, value)
      _setLastWrite(memoryAddress, value)
    }
  }

  const zeroPageX = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.getRegister(CPU_REGISTERS.X) + operand) & 0xff)
      return cpu.load(memoryAddress)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.getRegister(CPU_REGISTERS.X) + operand) & 0xff)
      cpu.store(memoryAddress, value)
      _setLastWrite(memoryAddress, value)
    }
  }

  const zeroPageY = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.getRegister(CPU_REGISTERS.Y) + operand) & 0xff)
      return cpu.load(memoryAddress)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((cpu.getRegister(CPU_REGISTERS.Y) + operand) & 0xff)
      cpu.store(memoryAddress, value)
      _setLastWrite(memoryAddress, value)
    }
  }

  const relative = {
    get: (operand) => cpuALU.getSignedByte(operand)
  }

  const aboslute = {
    get: (operand) => cpu.load(operand),
    set: (value, memoryAddress) => {
      cpu.store(memoryAddress, value)
      _setLastWrite(memoryAddress, value)
    }
  }

  const absoluteX = {
    get: (operand) => cpu.load((operand + cpu.getRegister(CPU_REGISTERS.X))),
    set: (value, operand) => {
      const memoryAddress = operand + cpu.getRegister(CPU_REGISTERS.X)
      cpu.store(memoryAddress, value)
      _setLastWrite(memoryAddress, value)
    }
  }

  const absoluteY = {
    get: (operand) => cpu.load((operand + cpu.getRegister(CPU_REGISTERS.Y))),
    set: (value, operand) => {
      const memoryAddress = operand + cpu.getRegister(CPU_REGISTERS.Y)
      cpu.store(memoryAddress, value)
      _setLastWrite(memoryAddress, value)
    }
  }

  const indirect = {
    get: (operand) => cpu.loadWord(operand)
  }

  const indexedIndirect = {
    get: (operand) => {
      const zeroPageOffset = (operand + cpu.getRegister(CPU_REGISTERS.X)) & 0xff

      const memoryAddress = cpu.load(zeroPageOffset) +
                  (cpu.load((zeroPageOffset + 1) & 0xff) << 8)

      return cpu.load(memoryAddress)
    },
    set: (value, operand) => {
      const zeroPageOffset = (operand + cpu.getRegister(CPU_REGISTERS.X)) & 0xff

      const memoryAddress = cpu.load(zeroPageOffset) +
                  (cpu.load((zeroPageOffset + 1) & 0xff) << 8)
      cpu.store(memoryAddress, value)
      _setLastWrite(memoryAddress, value)
    }
  }

  const indirectIndexed = {
    get: (operand) => {
      const memoryAddress = cpu.load(operand) +
                  (cpu.load((operand + 1) & 0xff) << 8)
      return cpu.load(memoryAddress + cpu.getRegister(CPU_REGISTERS.Y))
    },
    set: (value, operand) => {
      const memoryAddress = cpu.load(operand) +
                  (cpu.load((operand + 1) & 0xff) << 8) +
                  cpu.getRegister(CPU_REGISTERS.Y)
      cpu.store(memoryAddress, value)
      _setLastWrite(memoryAddress, value)
    }
  }

  const get = (addressingMode, operand) => {
    return CPU_ADDRESSING_MODES[addressingMode].get(operand)
  }

  const set = (addressingMode, value, operand) => {
    return CPU_ADDRESSING_MODES[addressingMode].set(value, operand)
  }

  const _setLastWrite = (address, value) => {
    const cpuController = cpu.getCPUController()
    if (cpuController.debugMode) {
      cpuController.lastWrite.address = address
      cpuController.lastWrite.value = value
    }
  }

  const CPU_ADDRESSING_MODES = [
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

  return {
    get,
    set
  }
}
