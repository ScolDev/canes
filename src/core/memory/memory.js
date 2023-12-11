import { CPU_ADDRESSING_MODES } from '../cpu/consts/addressing-modes'
import { MEMORY_MIRRORS } from './consts/memory-mirros'
import { CPU_MEMORY_MAP } from './consts/memory-map'
import { AddressingModes } from '../cpu/addressing-modes'

export class Memory {
  #cpu = null
  #cpuALU = null
  #MEM = null
  #addressingModes = null

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
    this.#MEM = new Uint8Array(CPU_MEMORY_MAP.Size)
    this.#addressingModes = new AddressingModes(this.#cpu, this.#cpuALU)
  }

  copy (buffer, offset) {
    buffer.copy(this.#MEM, offset)
  }

  getMemorySection (start, end) {
    const sectionSize = end - start + 1
    const endOfMirrors = MEMORY_MIRRORS.PPUIORegisters.end
    const memorySection = new Uint8Array(sectionSize)

    for (let idxMemory = start, idxSection = 0; idxMemory <= end; idxMemory++, idxSection++) {
      if (idxMemory < endOfMirrors) {
        memorySection[idxSection] = this.load(idxMemory)
      } else {
        memorySection.set(this.#MEM.subarray(idxMemory, end + 1), idxSection)
        break
      }
    }
    return memorySection
  }

  loadAddressByAddressingMode (addressingMode, operand) {
    if (addressingMode === CPU_ADDRESSING_MODES.Absolute) {
      return operand
    }

    if (operand & (0x00ff === 0xff)) {
      return this.load(operand) + (this.load(operand & 0xff00) << 8)
    }

    return this.loadByAddressingMode(addressingMode, operand)
  }

  loadByAddressingMode (addressingMode, operand) {
    return this.#addressingModes.get(addressingMode, operand)
  }

  load (memoryAddress) {
    const mirrors = this.#getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      return this.#loadMirror(memoryAddress, mirrors)
    }

    return this.#loadByte(memoryAddress)
  }

  loadWord (memoryAddress) {
    return this.load(memoryAddress) + (this.load(memoryAddress + 1) << 8)
  }

  store (memoryAddress, memoryValue) {
    const mirrors = this.#getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      this.#storeMirror(memoryAddress, memoryValue, mirrors)
      return
    }

    this.#storeByte(memoryAddress, memoryValue)
  }

  storeWord (memoryAddress, memoryValue) {
    this.store(memoryAddress, memoryValue)
    this.store(memoryAddress + 1, (memoryValue & 0xff00) >> 8)
  }

  storeByAddressingMode (addressingMode, value, operand) {
    this.#addressingModes.set(addressingMode, value, operand)
  }

  #getMemoryMirrors (memoryAddress) {
    for (const mirror of Object.values(MEMORY_MIRRORS)) {
      if (memoryAddress >= mirror.start && memoryAddress < mirror.end) {
        return {
          ...mirror
        }
      }
    }

    return { start: 0, end: 0, mirrorSize: 0 }
  }

  #loadByte (memoryAddress) {
    return this.#MEM[memoryAddress & 0xffff]
  }

  #loadMirror (memoryAddress, mirrors) {
    const { start, mirrorSize } = mirrors
    const relativeAddress = memoryAddress % mirrorSize
    const mirroredAddress = start + relativeAddress

    return this.#loadByte(mirroredAddress)
  }

  #storeByte (memoryAddress, memoryValue) {
    memoryAddress &= 0xffff
    this.#MEM[memoryAddress] = memoryValue & 0xff
  }

  #storeMirror (memoryAddress, value, mirrors) {
    const { start, mirrorSize } = mirrors
    const relativeAddress = memoryAddress % mirrorSize
    const mirroredAddress = start + relativeAddress

    this.#storeByte(mirroredAddress, value)
  }
}
