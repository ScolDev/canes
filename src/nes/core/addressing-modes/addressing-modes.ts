import { type NESControlBus } from '../control-bus/types'
import { CPURegisters } from '../cpu/consts/registers'
import { CPUMemoryMap } from '../memory/consts/memory-map'
import { CPUAddressingModes } from './consts/addressing-modes'
import {
  type NESAddrModesComponent,
  type CPUAddrMode,
  type CPUAddrModeHandler
} from './types'

export class AddressingModes implements NESAddrModesComponent {
  private readonly AddrModes = new Map<CPUAddrMode, CPUAddrModeHandler>()

  private constructor (private readonly control: NESControlBus) {}

  get (addressingMode: CPUAddrMode, operand?: number): number {
    const addr = this.AddrModes.get(addressingMode)
    if (addr === undefined) {
      return 0
    }
    return operand !== undefined ? addr.get(operand) : addr.get()
  }

  set (addressingMode: CPUAddrMode, value: number, operand?: number): void {
    const addr = this.AddrModes.get(addressingMode)
    if (addr?.set === undefined) {
      return
    }
    operand !== undefined ? addr.set(value, operand) : addr.set(value)
  }

  private initComponents (): void {
    this.loadAddressingModesHandlers()
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
      get: () => this.control.cpu.getRegister(CPURegisters.A),
      set: (value) => {
        this.control.cpu.setRegister(CPURegisters.A, value)
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
        return this.control.memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const memoryAddress = CPUMemoryMap.ZeroPage + (operand & 0xff)

        this.control.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private zeroPageX (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.control.cpu.getRegister(CPURegisters.X)
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((xRegister + operand) & 0xff)

        return this.control.memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const xRegister = this.control.cpu.getRegister(CPURegisters.X)
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((xRegister + operand) & 0xff)

        this.control.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private zeroPageY (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.control.cpu.getRegister(CPURegisters.Y)
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((yRegister + operand) & 0xff)

        return this.control.memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const yRegister = this.control.cpu.getRegister(CPURegisters.Y)
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((yRegister + operand) & 0xff)

        this.control.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private relative (): CPUAddrModeHandler {
    return {
      get: (operand) => this.control.alu.getSignedByte(operand)
    }
  }

  private aboslute (): CPUAddrModeHandler {
    return {
      get: (operand) => this.control.memory.load(operand),
      set: (value, memoryAddress) => {
        this.control.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private absoluteX (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.control.cpu.getRegister(CPURegisters.X)
        return this.control.memory.load(operand + xRegister)
      },
      set: (value, operand) => {
        const xRegister = this.control.cpu.getRegister(CPURegisters.X)
        const memoryAddress = operand + xRegister
        this.control.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private absoluteY (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.control.cpu.getRegister(CPURegisters.Y)
        return this.control.memory.load(operand + yRegister)
      },
      set: (value, operand) => {
        const yRegister = this.control.cpu.getRegister(CPURegisters.Y)
        const memoryAddress = operand + yRegister

        this.control.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private indirect (): CPUAddrModeHandler {
    return {
      get: (operand) => this.control.memory.loadWord(operand)
    }
  }

  private indexedIndirect (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.control.cpu.getRegister(CPURegisters.X)
        const zeroPageOffset = (operand + xRegister) & 0xff
        const memoryAddress =
          this.control.memory.load(zeroPageOffset) +
          (this.control.memory.load((zeroPageOffset + 1) & 0xff) << 8)

        return this.control.memory.load(memoryAddress)
      },
      set: (value, operand) => {
        const xRegister = this.control.cpu.getRegister(CPURegisters.X)
        const zeroPageOffset = (operand + xRegister) & 0xff
        const memoryAddress =
          this.control.memory.load(zeroPageOffset) +
          (this.control.memory.load((zeroPageOffset + 1) & 0xff) << 8)

        this.control.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private indirectIndexed (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.control.cpu.getRegister(CPURegisters.Y)
        const memoryAddress =
          this.control.memory.load(operand) +
          (this.control.memory.load((operand + 1) & 0xff) << 8)
        return this.control.memory.load(memoryAddress + yRegister)
      },
      set: (value, operand) => {
        const memoryAddress =
          this.control.memory.load(operand) +
          (this.control.memory.load((operand + 1) & 0xff) << 8) +
          this.control.cpu.getRegister(CPURegisters.Y)
        this.control.memory.store(memoryAddress, value)
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private setLastWrite (address: number, value: number): void {
    const cpuState = this.control.cpu.getCPUState()

    if (cpuState.debugMode) {
      cpuState.lastWrite.address = address
      cpuState.lastWrite.value = value
    }
  }

  static create (control: NESControlBus): NESAddrModesComponent {
    const addressingModes = new AddressingModes(control)
    addressingModes.initComponents()

    return addressingModes
  }
}
