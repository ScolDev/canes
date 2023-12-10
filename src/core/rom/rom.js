import { MAPPERS, MAPPERS_CODES } from './consts/mappers'
import { Buffer } from 'buffer'

export class ROM {
  #romLoader = null
  #romFileBuffer = null
  #signature = new Uint8Array([0x4e, 0x45, 0x53, 0x1a])
  #header = {
    isValid: false
  }

  constructor (romLoader) {
    this.#romLoader = romLoader
  }

  async load () {
    this.#romFileBuffer = await this.#romLoader.getBytes()
    this.#buildHeader(this.#romFileBuffer)
  }

  getHeader () {
    return this.#header
  }

  getPRG () {
    if (!this.#header.isValid) {
      return this.#getEmptyPRG()
    }

    const { start } = this.#getPRGOffsets()

    if (this.#header.mapper.code === MAPPERS_CODES.NROM) {
      const prgA = this.#romFileBuffer.subarray(start, start + 0x4000)
      const prgB = this.#header.numOfPRG === 1
        ? this.#romFileBuffer.subarray(start, start + 0x4000)
        : this.#romFileBuffer.subarray(start + 0x4000, start + 0x8000)

      const prg = Buffer.concat([prgA, prgB])
      return {
        buffer: prg,
        size: prg.length
      }
    }

    return this.#getEmptyPRG()
  }

  #getPRGOffsets () {
    const headerSize = 0x10
    const trainerSize = this.#header.hasTrainer ? 0x200 : 0x00
    const start = headerSize + trainerSize

    return {
      start
    }
  }

  #getEmptyPRG () {
    return {
      buffer: Buffer.from([]),
      size: 0
    }
  }

  #buildHeader (romFileBuffer) {
    const signature = romFileBuffer.subarray(0, 4)
    const flags6 = romFileBuffer[6]
    const numOfPRG = romFileBuffer[4]
    const numOfCHR = romFileBuffer[5]

    if (!signature.equals(this.#signature)) {
      this.#header.isValid = false
      return
    }

    this.#header.isValid = true
    this.#header.numOfPRG = numOfPRG
    this.#header.numOfCHR = numOfCHR
    this.#header.hasBatteryBacked = (flags6 >> 1 & 0x01) === 0x01
    this.#header.hasTrainer = (flags6 >> 2 & 0x01) === 0x01
    this.#header.size = romFileBuffer.length
    this.#header.prgSize = numOfPRG * 0x4000
    this.#header.chrSize = numOfCHR * 0x2000
    this.#header.mapper = this.#decodeMapper(flags6)
  }

  #decodeMapper (flags6) {
    const mapperCode = flags6 >> 4 & 0x0f

    return {
      code: mapperCode,
      name: MAPPERS[mapperCode]
    }
  }
}
