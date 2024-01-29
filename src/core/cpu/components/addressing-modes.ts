import { NESBusRequests } from '../../control-bus/consts/bus-events'
import { type NESControlBus } from '../../control-bus/types'
import { CPUMemoryMap } from '../../memory/consts/memory-map'
import { CPUAddressingModes } from '../consts/addressing-modes'
import { CPURegisters } from '../consts/registers'
import {
  type CPUAddrModeHandler,
  type CPUAddrMode,
  type NESAddrModesComponent
} from '../types'

export class AddressingModes implements NESAddrModesComponent {
  private readonly AddrModes = new Map<CPUAddrMode, CPUAddrModeHandler>()

  private constructor (private readonly control: NESControlBus) {
    this.loadAddressingModesHandlers()
  }

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
      get: () =>
        this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.A
        }),
      set: (value) => {
        this.control.notify({
          type: NESBusRequests.SetRegister,
          data: {
            register: CPURegisters.A,
            value
          }
        })
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
        return this.control.request<number>({
          type: NESBusRequests.Load,
          data: memoryAddress
        })
      },
      set: (value, operand) => {
        const memoryAddress = CPUMemoryMap.ZeroPage + (operand & 0xff)

        this.control.notify({
          type: NESBusRequests.Store,
          data: {
            address: memoryAddress,
            value
          }
        })
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private zeroPageX (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.X
        })
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((xRegister + operand) & 0xff)

        return this.control.request<number>({
          type: NESBusRequests.Load,
          data: memoryAddress
        })
      },
      set: (value, operand) => {
        const xRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.X
        })
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((xRegister + operand) & 0xff)

        this.control.notify({
          type: NESBusRequests.Store,
          data: {
            address: memoryAddress,
            value
          }
        })
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private zeroPageY (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.Y
        })
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((yRegister + operand) & 0xff)

        return this.control.request<number>({
          type: NESBusRequests.Load,
          data: memoryAddress
        })
      },
      set: (value, operand) => {
        const yRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.Y
        })
        const memoryAddress =
          CPUMemoryMap.ZeroPage + ((yRegister + operand) & 0xff)

        this.control.notify({
          type: NESBusRequests.Store,
          data: {
            address: memoryAddress,
            value
          }
        })
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private relative (): CPUAddrModeHandler {
    return {
      get: (operand) =>
        this.control.request({
          type: NESBusRequests.GetSignedByte,
          data: operand
        })
    }
  }

  private aboslute (): CPUAddrModeHandler {
    return {
      get: (operand) =>
        this.control.request<number>({
          type: NESBusRequests.Load,
          data: operand
        }),
      set: (value, memoryAddress) => {
        this.control.notify({
          type: NESBusRequests.Store,
          data: {
            address: memoryAddress,
            value
          }
        })
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private absoluteX (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.X
        })
        return this.control.request<number>({
          type: NESBusRequests.Load,
          data: operand + xRegister
        })
      },
      set: (value, operand) => {
        const xRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.X
        })
        const memoryAddress = operand + xRegister

        this.control.notify({
          type: NESBusRequests.Store,
          data: {
            address: memoryAddress,
            value
          }
        })
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private absoluteY (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.Y
        })
        return this.control.request<number>({
          type: NESBusRequests.Load,
          data: operand + yRegister
        })
      },
      set: (value, operand) => {
        const yRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.Y
        })
        const memoryAddress = operand + yRegister

        this.control.notify({
          type: NESBusRequests.Store,
          data: {
            address: memoryAddress,
            value
          }
        })
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private indirect (): CPUAddrModeHandler {
    return {
      get: (operand) =>
        this.control.request<number>({
          type: NESBusRequests.LoadWord,
          data: operand
        })
    }
  }

  private indexedIndirect (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const xRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.X
        })

        const zeroPageOffset = (operand + xRegister) & 0xff
        const zeroPageOffsetNext = (zeroPageOffset + 1) & 0xff

        const lsb = this.control.request<number>({
          type: NESBusRequests.Load,
          data: zeroPageOffset
        })
        const msb = this.control.request<number>({
          type: NESBusRequests.Load,
          data: zeroPageOffsetNext
        })
        const memoryAddress = lsb + (msb << 8)

        return this.control.request<number>({
          type: NESBusRequests.Load,
          data: memoryAddress
        })
      },
      set: (value, operand) => {
        const xRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.X
        })
        const zeroPageOffset = (operand + xRegister) & 0xff
        const zeroPageOffsetNext = (zeroPageOffset + 1) & 0xff

        const lsb = this.control.request<number>({
          type: NESBusRequests.Load,
          data: zeroPageOffset
        })
        const msb = this.control.request<number>({
          type: NESBusRequests.Load,
          data: zeroPageOffsetNext
        })
        const memoryAddress = lsb + (msb << 8)

        this.control.notify({
          type: NESBusRequests.Store,
          data: {
            address: memoryAddress,
            value
          }
        })
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private indirectIndexed (): CPUAddrModeHandler {
    return {
      get: (operand) => {
        const yRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.Y
        })
        const lsb = this.control.request<number>({
          type: NESBusRequests.Load,
          data: operand
        })
        const msb = this.control.request<number>({
          type: NESBusRequests.Load,
          data: (operand + 1) & 0xff
        })
        const memoryAddress = yRegister + lsb + (msb << 8)

        return this.control.request<number>({
          type: NESBusRequests.Load,
          data: memoryAddress
        })
      },
      set: (value, operand) => {
        const yRegister = this.control.request<number>({
          type: NESBusRequests.GetRegister,
          data: CPURegisters.Y
        })
        const lsb = this.control.request<number>({
          type: NESBusRequests.Load,
          data: operand
        })
        const msb = this.control.request<number>({
          type: NESBusRequests.Load,
          data: operand + 1
        })
        const memoryAddress = yRegister + (lsb + ((msb & 0xff) << 8))

        this.control.notify({
          type: NESBusRequests.Store,
          data: {
            address: memoryAddress,
            value
          }
        })
        this.setLastWrite(memoryAddress, value)
      }
    }
  }

  private setLastWrite (address: number, value: number): void {
    this.control.notify({
      type: NESBusRequests.SetLastWrite,
      data: {
        address,
        value
      }
    })
  }

  static create (control: NESControlBus): NESAddrModesComponent {
    return new AddressingModes(control)
  }
}
