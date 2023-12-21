import { ROM } from '../../src/core/rom/rom'
import { type NESRom } from '../../src/core/rom/types'
import { FileLoader } from '../../src/shared/utils/file-loader'

function areEquals (arr: Uint8Array, compareTo: Uint8Array): boolean {
  if (arr.length !== compareTo.length) return false

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== compareTo[i]) return false
  }

  return true
}

describe('Tests for the ROM module.', () => {
  test('should allow to load a valid .nes ROM file: NROM', async () => {
    const testROMFile = './tests/__roms__/nestest.nes'
    const fileLoader = FileLoader(testROMFile)

    const rom: NESRom = new ROM(fileLoader)
    await rom.load()

    const romInfo = rom.getHeader()

    expect(romInfo.banks.prg.length).toBe(1)
    expect(romInfo).toMatchObject({
      numOfPRG: 1,
      numOfCHR: 1,
      hasBatteryBacked: false,
      hasTrainer: false,
      size: 24592,
      mapper: {
        code: 0x00,
        name: 'NROM'
      }
    })
  })

  test('should allow to load a valid .nes ROM file: MMC1', async () => {
    const testROMFile = './tests/__roms__/instr_test-v3/official_only.nes'
    const fileLoader = FileLoader(testROMFile)

    const rom = new ROM(fileLoader)
    await rom.load()

    const romInfo = rom.getHeader()

    expect(romInfo.banks.prg.length).toBe(16)
    expect(romInfo).toMatchObject({
      numOfPRG: 16,
      numOfCHR: 0,
      hasBatteryBacked: false,
      hasTrainer: false,
      size: 262160,
      mapper: {
        code: 0x01,
        name: 'MMC1'
      }
    })
  })

  test('should build an invalid INES header when load an malformed .nes ROM', async () => {
    const testROMFile = './tests/__roms__/invalid_rom.nes'
    const fileLoader = FileLoader(testROMFile)

    const rom = new ROM(fileLoader)
    await rom.load()

    const romInfo = rom.getHeader()

    expect(romInfo).toEqual(null)
  })

  test('should throw an error when load an non-existent .nes ROM', async () => {
    const testROMFile = './tests/__roms__/non_existent.nes'
    const fileLoader = FileLoader(testROMFile)

    try {
      const rom = new ROM(fileLoader)
      await rom.load()

      expect(true).toBe(false)
    } catch (error: any) {
      expect(error.message).toBe('Cannot load the rom file')
    }
  })

  test('should get an empty ROM buffer from an invalid .nes ROM', async () => {
    const testROMFile = './tests/__roms__/invalid_rom.nes'
    const fileLoader = FileLoader(testROMFile)

    const rom = new ROM(fileLoader)
    await rom.load()

    const { size } = rom.getPRG()

    expect(size).toBe(0x00)
    expect(size).toBe(0)
  })

  test('should build the ROM buffer: NROM-128', async () => {
    // NROM with a single PRG bank (16k). Mirroring needed
    const testROMFile = './tests/__roms__/nestest.nes'
    const fileLoader = FileLoader(testROMFile)
    const prgFirstBytes = new Uint8Array([0x4c, 0xf5, 0xc5, 0x60, 0x78, 0xd8])
    const prgLastBytes = new Uint8Array([0xaf, 0xc5, 0x04, 0xc0, 0xf4, 0xc5])

    const rom = new ROM(fileLoader)
    await rom.load()

    const { buffer, size } = rom.getPRG()
    const firstBytes = buffer.subarray(0x0000, 0x0006)
    const lastBytes = buffer.subarray(0x7ffa, 0x8000)

    expect(size).toBe(0x8000)
    expect(areEquals(firstBytes, prgFirstBytes)).toBe(true)
    expect(areEquals(lastBytes, prgLastBytes)).toBe(true)
  })

  test('should build the ROM buffer: NROM-256', async () => {
    // NROM with two PRG bank (32k). Mirroring not needed
    const testROMFile = './tests/__roms__/cpu_reset/registers.nes'
    const fileLoader = FileLoader(testROMFile)

    const rom = new ROM(fileLoader)
    await rom.load()

    const { buffer, size } = rom.getPRG()
    const bufferA = buffer.subarray(0x0000, 0x4000)
    const bufferB = buffer.subarray(0x4000, 0x8000)

    expect(size).toBe(0x8000)
    expect(areEquals(bufferA, bufferB)).toBe(false)
  })
})
