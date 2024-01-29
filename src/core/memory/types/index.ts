import { type CPUAddrMode, type NESCpuComponent } from '../../cpu/types'

export interface MemoryMirror {
  start: number
  end: number
  mirrorSize: number
}

export interface NESMemoryComponent {
  copy: (buffer: Uint8Array, offset: number) => void
  getMemorySection: (start: number, end: number) => Uint8Array
  hasCrossedPage: (actual: number, next: number) => boolean
  hasExtraCycleByAddressingMode: (addrMode: CPUAddrMode, operand: number) => boolean
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
    operand?: number
  ) => void
}
