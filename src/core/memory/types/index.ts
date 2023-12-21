import { type CPUAddrMode, type NESCpuModule } from '../../cpu/types'

export interface MemoryMirror {
  start: number
  end: number
  mirrorSize: number
}

export interface NESMemoryModule {
  initComponents: () => void
  copy: (buffer: Uint8Array, offset: number) => void
  getMemorySection: (start: number, end: number) => Uint8Array
  loadAddressByAddressingMode: (
    addressingMode: CPUAddrMode,
    operand: number
  ) => number
  loadByAddressingMode: (
    addressingMode: CPUAddrMode,
    operand?: number
  ) => number
  load: (memoryAddress: number) => number
  loadWord: (memoryAddress: number) => number
  store: (memoryAddress: number, memoryValue: number) => void
  storeWord: (memoryAddress: number, memoryValue: number) => void
  storeByAddressingMode: (
    addressingMode: CPUAddrMode,
    value: number,
    operand: number
  ) => void
}

export type NESMemory = NESMemoryModule | undefined
export type MemoryCpu = NESCpuModule
