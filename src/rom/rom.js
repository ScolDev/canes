import { MAPPERS, MAPPERS_CODES } from './consts/mappers'
import { Buffer } from 'buffer'

export const ROM = async (romLoader) => {
  let romFileBuffer = null
  const signature = new Uint8Array([0x4e, 0x45, 0x53, 0x1a])
  const header = {
    isValid: false,
    numOfPRG: 0,
    numOfCHR: 0,
    hasBatteryBacked: false,
    hasTrainer: false,
    size: 0,
    prgSize: 0,
    chrSize: 0,
    mapper: {
      code: 0x00,
      name: ''
    }
  }

  const getHeader = () => {
    return header
  }

  const getPRG = () => {
    const { start } = getPRGOffsets()

    if (header.mapper.code === MAPPERS_CODES.NROM) {
      const prgA = romFileBuffer.subarray(start, start + 0x4000)
      const prgB = header.numOfPRG === 1
        ? romFileBuffer.subarray(start, start + 0x4000)
        : romFileBuffer.subarray(start + 0x4000, start + 0x8000)

      const prg = Buffer.concat([prgA, prgB])
      return {
        buffer: prg,
        size: prg.length
      }
    }
    return {
      buffer: Buffer.from([]),
      size: 0
    }
  }

  const getPRGOffsets = () => {
    const headerSize = 0x10
    const trainerSize = header.hasTrainer ? 0x200 : 0x00
    const start = headerSize + trainerSize

    return {
      start
    }
  }

  const load = async () => {
    romFileBuffer = await romLoader.getBytes()
    buildHeader(romFileBuffer)
  }

  const buildHeader = (romFileBuffer) => {
    const _signature = romFileBuffer.subarray(0, 4)
    const flags6 = romFileBuffer[6]
    const numOfPRG = romFileBuffer[4]
    const numOfCHR = romFileBuffer[5]

    if (_signature.equals(signature)) header.isValid = true

    header.numOfPRG = numOfPRG
    header.numOfCHR = numOfCHR
    header.hasBatteryBacked = (flags6 >> 1 & 0x01) === 0x01
    header.hasTrainer = (flags6 >> 2 & 0x01) === 0x01
    header.size = romFileBuffer.length
    header.prgSize = numOfPRG * 0x4000
    header.chrSize = numOfCHR * 0x2000
    header.mapper = decodeMapper(flags6)
  }

  const decodeMapper = (flags6) => {
    const mapperCode = flags6 >> 4 & 0x0f

    return {
      code: mapperCode,
      name: MAPPERS[mapperCode]
    }
  }

  await load()

  return {
    getHeader,
    getPRG
  }
}
