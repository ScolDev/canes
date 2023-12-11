import { CPU_MEMORY_MAP } from '../memory/consts/memory-map'
import { CPU_REGISTERS } from './consts/registers'

export class AddressingModes {
  #cpu = null
  #cpuALU = null

  #acumulator = {
    get: () => this.#cpu.getRegister(CPU_REGISTERS.A),
    set: (value) => (this.#cpu.setRegister(CPU_REGISTERS.A, value))
  }

  #immediate = {
    get: (operand) => (operand & 0xff)
  }

  #zeroPage = {
    get: (operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
      return this.#cpu.memory.load(memoryAddress)
    },
    set: (value, operand) => {
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)

      this.#cpu.memory.store(memoryAddress, value)
      this.#setLastWrite(memoryAddress, value)
    }
  }

  #zeroPageX = {
    get: (operand) => {
      const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((xRegister + operand) & 0xff)

      return this.#cpu.memory.load(memoryAddress)
    },
    set: (value, operand) => {
      const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((xRegister + operand) & 0xff)

      this.#cpu.memory.store(memoryAddress, value)
      this.#setLastWrite(memoryAddress, value)
    }
  }

  #zeroPageY = {
    get: (operand) => {
      const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((yRegister + operand) & 0xff)

      return this.#cpu.memory.load(memoryAddress)
    },
    set: (value, operand) => {
      const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
      const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((yRegister + operand) & 0xff)

      this.#cpu.memory.store(memoryAddress, value)
      this.#setLastWrite(memoryAddress, value)
    }
  }

  #relative = {
    get: (operand) => this.#cpuALU.getSignedByte(operand)
  }

  #aboslute = {
    get: (operand) => this.#cpu.memory.load(operand),
    set: (value, memoryAddress) => {
      this.#cpu.memory.store(memoryAddress, value)
      this.#setLastWrite(memoryAddress, value)
    }
  }

  #absoluteX = {
    get: (operand) => {
      const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
      return this.#cpu.memory.load(operand + xRegister)
    },
    set: (value, operand) => {
      const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
      const memoryAddress = operand + xRegister
      this.#cpu.memory.store(memoryAddress, value)
      this.#setLastWrite(memoryAddress, value)
    }
  }

  #absoluteY = {
    get: (operand) => {
      const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
      return this.#cpu.memory.load((operand + yRegister))
    },
    set: (value, operand) => {
      const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
      const memoryAddress = operand + yRegister

      this.#cpu.memory.store(memoryAddress, value)
      this.#setLastWrite(memoryAddress, value)
    }
  }

  #indirect = {
    get: (operand) => this.#cpu.memory.loadWord(operand)
  }

  #indexedIndirect = {
    get: (operand) => {
      const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
      const zeroPageOffset = (operand + xRegister) & 0xff
      const memoryAddress = this.#cpu.memory.load(zeroPageOffset) +
            (this.#cpu.memory.load((zeroPageOffset + 1) & 0xff) << 8)

      return this.#cpu.memory.load(memoryAddress)
    },
    set: (value, operand) => {
      const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
      const zeroPageOffset = (operand + xRegister) & 0xff
      const memoryAddress = this.#cpu.memory.load(zeroPageOffset) +
                  (this.#cpu.memory.load((zeroPageOffset + 1) & 0xff) << 8)

      this.#cpu.memory.store(memoryAddress, value)
      this.#setLastWrite(memoryAddress, value)
    }
  }

  #indirectIndexed = {
    get: (operand) => {
      const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
      const memoryAddress = this.#cpu.memory.load(operand) +
                  (this.#cpu.memory.load((operand + 1) & 0xff) << 8)
      return this.#cpu.memory.load(memoryAddress + yRegister)
    },
    set: (value, operand) => {
      const memoryAddress = this.#cpu.memory.load(operand) +
                  (this.#cpu.memory.load((operand + 1) & 0xff) << 8) +
                  this.#cpu.getRegister(CPU_REGISTERS.Y)
      this.#cpu.memory.store(memoryAddress, value)
      this.#setLastWrite(memoryAddress, value)
    }
  }

  #AddressingModes = [
    this.#acumulator,
    this.#immediate,
    this.#zeroPage,
    this.#zeroPageX,
    this.#zeroPageY,
    this.#relative,
    this.#aboslute,
    this.#absoluteX,
    this.#absoluteY,
    this.#indirect,
    this.#indexedIndirect,
    this.#indirectIndexed
  ]

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  get (addressingMode, operand) {
    return this.#AddressingModes[addressingMode].get(operand)
  }

  set (addressingMode, value, operand) {
    return this.#AddressingModes[addressingMode].set(value, operand)
  }

  #setLastWrite (address, value) {
    const cpuController = this.#cpu.getCPUController()

    if (cpuController.debugMode) {
      cpuController.lastWrite.address = address
      cpuController.lastWrite.value = value
    }
  }
}
