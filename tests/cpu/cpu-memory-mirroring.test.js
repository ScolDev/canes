
import { CPU } from '../../src/core/cpu/cpu'

describe('Tests for CPU memory mirroring.', () => {
  let cpu

  beforeEach(() => {
    cpu = CPU()
  })

  test('should mirror the internal RAM: Storing and loading single bytes', () => {
    const ramStart = 0x0000
    const ramEnd = 0x0800
    const dummyByte = 0x61
    const dummyByteEdge = 0x81

    cpu.powerUp()
    for (let index = ramStart; index < ramEnd; index++) {
      cpu.store(index, dummyByte)
    }
    cpu.store(ramStart, dummyByteEdge)
    cpu.store(ramEnd - 1, dummyByteEdge)

    // 0x0800 - 0x0fff
    expect(cpu.load(0x0800)).toBe(dummyByteEdge)
    expect(cpu.load(0x0a52)).toBe(dummyByte)
    expect(cpu.load(0x0fff)).toBe(dummyByteEdge)

    // 0x1000 - 0x17ff
    expect(cpu.load(0x1000)).toBe(dummyByteEdge)
    expect(cpu.load(0x153a)).toBe(dummyByte)
    expect(cpu.load(0x17ff)).toBe(dummyByteEdge)

    // 0x1800 - 0x1fff
    expect(cpu.load(0x1800)).toBe(dummyByteEdge)
    expect(cpu.load(0x1a00)).toBe(dummyByte)
    expect(cpu.load(0x1fff)).toBe(dummyByteEdge)
  })

  test('should mirror the internal RAM: Storing and loading two bytes', () => {
    const ramStart = 0x0000
    const ramEnd = 0x0800
    const dummyByte = 0xc110
    const dummyByteEdge = 0xf1a1

    cpu.powerUp()
    for (let index = ramStart; index < ramEnd; index += 2) {
      cpu.storeWord(index, dummyByte)
    }
    cpu.storeWord(ramStart, dummyByteEdge)
    cpu.storeWord(ramEnd - 2, dummyByteEdge)

    // 0x0800 - 0x0fff
    expect(cpu.loadWord(0x0800)).toBe(dummyByteEdge)
    expect(cpu.loadWord(0x0a52)).toBe(dummyByte)
    expect(cpu.loadWord(0x0ffe)).toBe(dummyByteEdge)

    // 0x1000 - 0x17ff
    expect(cpu.loadWord(0x1000)).toBe(dummyByteEdge)
    expect(cpu.loadWord(0x153a)).toBe(dummyByte)
    expect(cpu.loadWord(0x17fe)).toBe(dummyByteEdge)

    // 0x1800 - 0x1fff
    expect(cpu.loadWord(0x1800)).toBe(dummyByteEdge)
    expect(cpu.loadWord(0x1a00)).toBe(dummyByte)
    expect(cpu.loadWord(0x1ffe)).toBe(dummyByteEdge)
  })

  test('should mirror the PPU I/O Registers: Storing and loading bytes', () => {
    const ppuIOStart = 0x2000
    const ppuIOEnd = 0x2008
    const ppuIOMirrorsEnd = 0x4000
    const ppuIOMirrorsSize = 0x08
    const ppuIOBuffer = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0])

    cpu.powerUp()
    for (let index = ppuIOStart, bufferIndex = 0; index < ppuIOEnd; index++, bufferIndex++) {
      cpu.store(index, ppuIOBuffer[bufferIndex])
    }

    for (let index = ppuIOEnd; index < ppuIOMirrorsEnd; index += ppuIOMirrorsSize) {
      const bufferSize = index + ppuIOMirrorsSize - 1
      const mirrorBuffer = cpu.getMemorySection(index, bufferSize)

      expect(mirrorBuffer).toEqual(ppuIOBuffer)
    }
  })
})
