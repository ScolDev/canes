import { ROM } from '../../src/rom/rom'
import { FileLoader } from '../../src/utils/file-loader'

describe('Tests for the ROM module.', () => {
  test('should allow to load a valid .nes ROM file: NROM', async () => {
    const testROMFile = './test/__roms__/nestest.nes'
    const fileLoader = FileLoader(testROMFile)

    const rom = await ROM(fileLoader)
    const romInfo = rom.getHeader()

    expect(romInfo).toEqual({
      isValid: true,
      numOfPRG: 1,
      numOfCHR: 1,
      hasBatteryBacked: false,
      hasTrainer: false,
      size: 24592,
      prgSize: 16384,
      chrSize: 8192,
      mapper: {
        code: 0x00,
        name: 'NROM'
      }
    })
  })

  test('should allow to load a valid .nes ROM file: MMC1', async () => {
    const testROMFile = './test/__roms__/official_only.nes'
    const fileLoader = FileLoader(testROMFile)

    const rom = await ROM(fileLoader)
    const romInfo = rom.getHeader()

    expect(romInfo).toEqual({
      isValid: true,
      numOfPRG: 16,
      numOfCHR: 0,
      hasBatteryBacked: false,
      hasTrainer: false,
      size: 262160,
      prgSize: 262144,
      chrSize: 0,
      mapper: {
        code: 0x01,
        name: 'MMC1'
      }
    })
  })

  test('should build the ROM buffer: NROM', async () => {
    const testROMFile = './test/__roms__/nestest.nes'
    const fileLoader = FileLoader(testROMFile)
    const prgFirstBytes = new Uint8Array([0x4c, 0xf5, 0xc5, 0x60, 0x78, 0xd8])
    const prgLastBytes = new Uint8Array([0xaf, 0xc5, 0x04, 0xc0, 0xf4, 0xc5])

    const rom = await ROM(fileLoader)
    const { buffer, size } = rom.getPRG()
    const firstBytes = buffer.subarray(0x0000, 0x0006)
    const lastBytes = buffer.subarray(0x7ffa, 0x8000)

    expect(size).toBe(0x8000)
    expect(firstBytes.equals(prgFirstBytes)).toBe(true)
    expect(lastBytes.equals(prgLastBytes)).toBe(true)
  })
})
