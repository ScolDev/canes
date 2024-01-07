import { CPUMemoryMap } from '../../memory/consts/memory-map'
import { CPUAddressingModes } from '../consts/addressing-modes'
import { CPURegisters } from '../consts/registers'
import {
  type CPUAddrModeHandler,
  type CPUAddrMode,
  type AddrModesCpu,
  type AddrModesAlu,
  type NESAddrModesComponent
} from '../types'

export class AddressingModes implements NESAddrModesComponent {
  private readonly cpu: AddrModesCpu
  private readonly cpuALU: AddrModesAlu | undefined
  private readonly memory
  private readonly AddrModes = new Map<CPUAddrMode, CPUAddrModeHandler>()

  private constructor (cpu: AddrModesCpu) {
    this.cpu = cpu

    const { cpuALU, memory } = cpu.getComponents()
    this.cpuALU = cpuALU
    this.memory = memory
  }

  initComponents (): void {
    this.loadAddressingModesHandlers()
  }

  get (addressingMode: CPUAddrMode, operand: number): number {
    const addr = this.AddrModes.get(addressingMode)
    if (addr !== undefined) {
      return addr.get(operand)
    }

    return 0
  }

  set (addressingMode: CPUAddrMode, value: number, operand: number): void {
    const addr = this.AddrModes.get(addressingMode)
    if (addr?.set !== undefined) {
      addr.set(value, operand)
    }
  }

  private loadAddressingModesHandlers (): void {
    this.AddrModes.set(CPUAddressingModes.Accumulator, this.accumulator())
    this.AddrModes.set(CPUAddressingModes.Immediate, this.immediate())
    this.AddrModes.set(CPUAddressingModes.ZeroPage, this.zeroPage())
    this.AddrModes.set(CPUAddressingModes.ZeroPageX, this.zeroPageX())
    this.AddrModes.set(CPUAddressingModes.ZeroPageY, this.zeroPageY())
    this.AddrModes.set(CPUAddressingModes.Relative, this.relative())
    this.AddrModes.set(CPUAddressingModes.Absolute, this.aboslute())
    this.AddrModes.set(CPUAddressingModes.AbsoluteX, this.absoluteX())
    this.AddrModes.set(CPUAddressingModes.AbsoluteY, this.absoluteY())
    this.AddrModes.set(CPUAddressingModes.Indirect, this.indirect())
    this.AddrModes.set(
      CPUAddressingModes.IndexedIndirect,
      this.indexedIndirect()
    )
    this.AddrModes.set(
      CPUAddressingModes.IndirectIndexed,
      this.indirectIndexed()
    )
  }

  private accumulator (): CPUAddrModeHandler {
    return {
      get: () => this.cpu.getRegister(CPURegisters.A),
      set: (value) => {
        this.cpu.setRegister(CPURegisters.A, value)
      }
    }
  }

  private immediate (): CPUAddrModeHandler {
    return {
      get: (operand) => operand & 0xff
    }
  }

  private zeroPage (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const memoryAddress = CPUMemoryMap.ZeroPage + (operand & 0xff)
        return this.memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const memoryAddress = CPUMemoryMap.ZeroPage + (operand & 0xff)

        this.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private zeroPageX (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.cpu.getRegister(CPURegisters.X)
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((xRegister + operand) & 0xff)

        return this.memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const xRegister = this.cpu.getRegister(CPURegisters.X)
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((xRegister + operand) & 0xff)

        this.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private zeroPageY (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.cpu.getRegister(CPURegisters.Y)
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((yRegister + operand) & 0xff)

        return this.memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const yRegister = this.cpu.getRegister(CPURegisters.Y)
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((yRegister + operand) & 0xff)

        this.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private relative (): CPUAddrModeHandler {
    return {
      get: (operand) => this.cpuALU.getSignedByte(operand)
    }
  }

  private aboslute (): CPUAddrModeHandler {
    return {
      get: (operand) => this.memory.load(operand),
      set: (value, memoryAddress) => {
        this.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private absoluteX (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.cpu.getRegister(CPURegisters.X)
        return this.memory.load(operand + xRegister)
      },
      set: (value, operand) => {
        const xRegister = this.cpu.getRegister(CPURegisters.X)
        const memoryAddress = operand + xRegister
        this.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private absoluteY (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.cpu.getRegister(CPURegisters.Y)
        return this.memory.load(operand + yRegister)
      },
      set: (value, operand) => {
        const yRegister = this.cpu.getRegister(CPURegisters.Y)
        const memoryAddress = operand + yRegister

        this.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private indirect (): CPUAddrModeHandler {
    return {
      get: (operand) => this.memory.loadWord(operand)
    }
  }

  private indexedIndirect (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.cpu.getRegister(CPURegisters.X)
        const zeroPageOffset = (operand + xRegister) & 0xff
        const memoryAddress =
          this.memory.load(zeroPageOffset) +
          (this.memory.load((zeroPageOffset + 1) & 0xff) << 8)

        return this.memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const xRegister = this.cpu.getRegister(CPURegisters.X)
        const zeroPageOffset = (operand + xRegister) & 0xff
        const memoryAddress =
          this.memory.load(zeroPageOffset) +
          (this.memory.load((zeroPageOffset + 1) & 0xff) << 8)

        this.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private indirectIndexed (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.cpu.getRegister(CPURegisters.Y)
        const memoryAddress =
          this.memory.load(operand) +
          (this.memory.load((operand + 1) & 0xff) << 8)
        return this.memory.load(memoryAddress + yRegister)
      },
      set: (value, operand) => {
        const memoryAddress =
          this.memory.load(operand) +
          (this.memory.load((operand + 1) & 0xff) << 8) +
          this.cpu.getRegister(CPURegisters.Y)
        this.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private setLastWrite (address: number, value: number): void {
    const cpuState = this.cpu.getCPUState()

    if (cpuState.debugMode) {
      cpuState.lastWrite.address = address
      cpuState.lastWrite.value = value
    }
  }

  static create (cpu: AddrModesCpu): NESAddrModesComponent {
    const addressingModes = new AddressingModes(cpu)
    addressingModes.initComponents()

    return addressingModes
  }
}
