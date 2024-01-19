import { AddressingModes } from '../cpu/components/addressing-modes'
import { CPUAddressingModes } from '../cpu/consts/addressing-modes'
import { CPURegisters } from '../cpu/consts/registers'
import {
  type NESAddrModesComponent,
  type CPUAddrMode,
  type NESCpuComponent
} from '../cpu/types'
import { CPUMemoryMap } from './consts/memory-map'
import { MemoryMirrors } from './consts/memory-mirrors'
import {
  type MemoryCpu,
  type NESMemoryComponent,
  type MemoryMirror
} from './types'

export class Memory implements NESMemoryComponent {
  private readonly cpu: MemoryCpu
  private addressingModes: NESAddrModesComponent | null

  private MEM = new Uint8Array(CPUMemoryMap.Size)

  private constructor (cpu: MemoryCpu) {
    this.cpu = cpu
  }

  initComponents (): void {
    this.addressingModes = AddressingModes.create(this.cpu)
  }

  copy (buffer: Uint8Array, offset: number): void {
    this.MEM.set(buffer, offset)
  }

  getMemorySection (start: number, end: number): Uint8Array {
    const sectionSize = end - start + 1
    const endOfMirrors = MemoryMirrors.PPUIORegisters.end
    const memorySection = new Uint8Array(sectionSize)

    for (
      let idxMemory = start, idxSection = 0;
      idxMemory <= end;
      idxMemory++, idxSection++
    ) {
      if (idxMemory < endOfMirrors) {
        memorySection[idxSection] = this.load(idxMemory)
      } else {
        memorySection.set(this.MEM.subarray(idxMemory, end + 1), idxSection)
        break
      }
    }
    return memorySection
  }

  hasCrossedPage (actual: number, next: number): boolean {
    return (actual & 0xff00) !== (next & 0xff00)
  }

  hasExtraCycleByAddressingMode (addrMode: CPUAddrMode, operand: number): boolean {
    if (addrMode === CPUAddressingModes.AbsoluteX) {
      const xRegister = this.cpu.getRegister(CPURegisters.X)
      return this.hasCrossedPage(operand, operand + xRegister)
    }

    if (addrMode === CPUAddressingModes.AbsoluteY) {
      const yRegister = this.cpu.getRegister(CPURegisters.Y)
      return this.hasCrossedPage(operand, operand + yRegister)
    }

    if (addrMode === CPUAddressingModes.IndirectIndexed) {
      const yRegister = this.cpu.getRegister(CPURegisters.Y)
      const memoryAddress =
          this.load(operand) +
          (this.load((operand + 1) & 0xff) << 8)

      return this.hasCrossedPage(memoryAddress, memoryAddress + yRegister)
    }

    return false
  }

  loadAddressByAddressingMode (
    addressingMode: CPUAddrMode,
    operand: number
  ): number {
    if (addressingMode === CPUAddressingModes.Absolute) {
      return operand
    }

    if ((operand & 0x00ff) === 0xff) {
      return this.load(operand) + (this.load(operand & 0xff00) << 8)
    }

    return this.loadByAddressingMode(addressingMode, operand)
  }

  loadByAddressingMode (addressingMode: CPUAddrMode, operand?: number): number {
    return this.addressingModes.get(addressingMode, operand)
  }

  load (memoryAddress: number): number {
    const mirrors = this.getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      return this.loadMirror(memoryAddress, mirrors)
    }

    return this.loadByte(memoryAddress)
  }

  loadWord (memoryAddress: number): number {
    return this.load(memoryAddress) + (this.load(memoryAddress + 1) << 8)
  }

  store (memoryAddress: number, memoryValue: number): void {
    const mirrors = this.getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      this.storeMirror(memoryAddress, memoryValue, mirrors)
      return
    }

    this.storeByte(memoryAddress, memoryValue)
  }

  storeWord (memoryAddress: number, memoryValue: number): void {
    this.store(memoryAddress, memoryValue)
    this.store(memoryAddress + 1, (memoryValue & 0xff00) >> 8)
  }

  storeByAddressingMode (
    addressingMode: CPUAddrMode,
    value: number,
    operand: number
  ): void {
    this.addressingModes.set(addressingMode, value, operand)
  }

  private getMemoryMirrors (memoryAddress: number): MemoryMirror {
    for (const mirror of Object.values(MemoryMirrors)) {
      if (memoryAddress >= mirror.start && memoryAddress < mirror.end) {
        return mirror
      }
    }

    return { start: 0, end: 0, mirrorSize: 0 }
  }

  private loadByte (memoryAddress: number): number {
    return this.MEM[memoryAddress & 0xffff]
  }

  private loadMirror (memoryAddress: number, mirror: MemoryMirror): number {
    const { start, mirrorSize } = mirror
    const relativeAddress = memoryAddress % mirrorSize
    const mirroredAddress = start + relativeAddress

    return this.loadByte(mirroredAddress)
  }

  private storeByte (memoryAddress: number, memoryValue: number): void {
    memoryAddress &= 0xffff
    this.MEM[memoryAddress] = memoryValue & 0xff
  }

  private storeMirror (
    memoryAddress: number,
    value: number,
    mirror: MemoryMirror
  ): void {
    const { start, mirrorSize } = mirror
    const relativeAddress = memoryAddress % mirrorSize
    const mirroredAddress = start + relativeAddress

    this.storeByte(mirroredAddress, value)
  }

  static create (cpu: NESCpuComponent): NESMemoryComponent {
    return new Memory(cpu)
  }
}
