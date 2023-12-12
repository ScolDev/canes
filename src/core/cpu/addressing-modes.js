import { CPU_MEMORY_MAP } from '../memory/consts/memory-map'
import { CPU_REGISTERS } from './consts/registers'

export class AddressingModes {
  #cpu = null
  #cpuALU = null
  #memory = null
  #AddressingModes = null

  constructor (cpu) {
    this.#cpu = cpu

    const { cpuALU, memory } = cpu.getComponents()
    this.#cpuALU = cpuALU
    this.#memory = memory
  }

  initComponents () {
    this.#AddressingModes = [
      this.#acumulator(),
      this.#immediate(),
      this.#zeroPage(),
      this.#zeroPageX(),
      this.#zeroPageY(),
      this.#relative(),
      this.#aboslute(),
      this.#absoluteX(),
      this.#absoluteY(),
      this.#indirect(),
      this.#indexedIndirect(),
      this.#indirectIndexed()
    ]
  }

  get (addressingMode, operand) {
    const addr = this.#AddressingModes[addressingMode]
    return addr.get.call(this, operand)
  }

  set (addressingMode, value, operand) {
    const addr = this.#AddressingModes[addressingMode]
    return addr.set.call(this, value, operand)
  }

  #acumulator () {
    return {
      get: () => this.#cpu.getRegister(CPU_REGISTERS.A),
      set: (value) => (this.#cpu.setRegister(CPU_REGISTERS.A, value))
    }
  }

  #immediate () {
    return {
      get: (operand) => (operand & 0xff)
    }
  }

  #zeroPage () {
    return {
      get: (operand) => {
        const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)
        return this.#memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const memoryAddress = CPU_MEMORY_MAP.ZeroPage + (operand & 0xff)

        this.#memory.store(memoryAddress, value)
        this.#setLastWrite(memoryAddress, value)
      }
    }
  }

  #zeroPageX () {
    return {
      get: (operand) => {
        const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
        const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((xRegister + operand) & 0xff)

        return this.#memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
        const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((xRegister + operand) & 0xff)

        this.#memory.store(memoryAddress, value)
        this.#setLastWrite(memoryAddress, value)
      }
    }
  }

  #zeroPageY () {
    return {
      get: (operand) => {
        const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
        const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((yRegister + operand) & 0xff)

        return this.#memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
        const memoryAddress = CPU_MEMORY_MAP.ZeroPage + ((yRegister + operand) & 0xff)

        this.#memory.store(memoryAddress, value)
        this.#setLastWrite(memoryAddress, value)
      }
    }
  }

  #relative () {
    return {
      get: (operand) => this.#cpuALU.getSignedByte(operand)
    }
  }

  #aboslute () {
    return {
      get: (operand) => this.#memory.load(operand),
      set: (value, memoryAddress) => {
        this.#memory.store(memoryAddress, value)
        this.#setLastWrite(memoryAddress, value)
      }
    }
  }

  #absoluteX () {
    return {
      get: (operand) => {
        const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
        return this.#memory.load(operand + xRegister)
      },
      set: (value, operand) => {
        const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
        const memoryAddress = operand + xRegister
        this.#memory.store(memoryAddress, value)
        this.#setLastWrite(memoryAddress, value)
      }
    }
  }

  #absoluteY () {
    return {
      get: (operand) => {
        const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
        return this.#memory.load((operand + yRegister))
      },
      set: (value, operand) => {
        const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
        const memoryAddress = operand + yRegister

        this.#memory.store(memoryAddress, value)
        this.#setLastWrite(memoryAddress, value)
      }
    }
  }

  #indirect () {
    return {
      get: (operand) => this.#memory.loadWord(operand)
    }
  }

  #indexedIndirect () {
    return {
      get: (operand) => {
        const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
        const zeroPageOffset = (operand + xRegister) & 0xff
        const memoryAddress = this.#memory.load(zeroPageOffset) +
              (this.#memory.load((zeroPageOffset + 1) & 0xff) << 8)

        return this.#memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const xRegister = this.#cpu.getRegister(CPU_REGISTERS.X)
        const zeroPageOffset = (operand + xRegister) & 0xff
        const memoryAddress = this.#memory.load(zeroPageOffset) +
                    (this.#memory.load((zeroPageOffset + 1) & 0xff) << 8)

        this.#memory.store(memoryAddress, value)
        this.#setLastWrite(memoryAddress, value)
      }
    }
  }

  #indirectIndexed () {
    return {
      get: (operand) => {
        const yRegister = this.#cpu.getRegister(CPU_REGISTERS.Y)
        const memoryAddress = this.#memory.load(operand) +
                    (this.#memory.load((operand + 1) & 0xff) << 8)
        return this.#memory.load(memoryAddress + yRegister)
      },
      set: (value, operand) => {
        const memoryAddress = this.#memory.load(operand) +
                    (this.#memory.load((operand + 1) & 0xff) << 8) +
                    this.#cpu.getRegister(CPU_REGISTERS.Y)
        this.#memory.store(memoryAddress, value)
        this.#setLastWrite(memoryAddress, value)
      }
    }
  }

  #setLastWrite (address, value) {
    const cpuController = this.#cpu.getCPUController()

    if (cpuController.debugMode) {
      cpuController.lastWrite.address = address
      cpuController.lastWrite.value = value
    }
  }

  static create (cpu) {
    const addressingModes = new AddressingModes(cpu)
    addressingModes.initComponents()

    return addressingModes
  }
}
