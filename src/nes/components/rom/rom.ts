import {
  type ROMBank,
  type ROMMapper,
  type ROMHeader,
  type ROMLoader,
  type NESRomComponent,
  type ROMBuffer
} from './types'
import { Buffer } from 'buffer'
import { MapperCodes, MapperNames } from './consts/mapper'
import { ROMFile } from './consts/rom-file'
import { ROMSignature } from './consts/signature'

export class ROM implements NESRomComponent {
  private readonly romLoader: ROMLoader
  private header: ROMHeader | null = null

  private romFileBuffer = new Uint8Array()
  private readonly signature = new Uint8Array(ROMSignature)

  constructor (romLoader: ROMLoader) {
    this.romLoader = romLoader
  }

  async load (): Promise<void> {
    this.romFileBuffer = await this.romLoader.getBytes()
    this.header = this.buildHeader(this.romFileBuffer)
  }

  getHeader (): ROMHeader | null {
    return this.header
  }

  getPRG (): ROMBuffer {
    if (this.header === null) {
      return this.getEmptyPRG()
    }

    if (this.header.mapper.code === MapperCodes.NROM) {
      const prgBanks = this.header.banks.prg

      const prgA = prgBanks[0].data
      const prgB = this.header.numOfPRG === 2 ? prgBanks[1].data : prgA

      const prg = Buffer.concat([prgA, prgB])
      return {
        buffer: prg,
        size: prg.length
      }
    }

    return this.getEmptyPRG()
  }

  private getEmptyPRG (): ROMBuffer {
    return {
      buffer: new Uint8Array(),
      size: 0
    }
  }

  private buildHeader (romFileBuffer: Uint8Array): ROMHeader | null {
    if (!this.isValidSignature(romFileBuffer)) {
      return null
    }

    const numOfPRG = romFileBuffer[4]
    const numOfCHR = romFileBuffer[5]
    const flags6 = romFileBuffer[6]
    const hasBatteryBacked = ((flags6 >> 1) & 0x01) === 0x01
    const hasTrainer = ((flags6 >> 2) & 0x01) === 0x01
    const prgBanks = this.getPRGBanks(romFileBuffer, hasTrainer)
    const mapper = this.decodeMapper(flags6)

    return {
      numOfPRG,
      numOfCHR,
      hasBatteryBacked,
      hasTrainer,
      size: romFileBuffer.length,
      banks: {
        prg: prgBanks
      },
      mapper
    }
  }

  private getPRGBanks (romFileBuffer: Uint8Array, hasTrainer: boolean): ROMBank[] {
    const numOfPRG = romFileBuffer[4]
    const banks: ROMBank[] = []

    let prgOffset = ROMFile.HeaderSize + (hasTrainer ? ROMFile.TrainerSize : 0)
    for (let i = 0; i < numOfPRG; prgOffset += ROMFile.PRGBankSize, i++) {
      banks.push({
        data: romFileBuffer.subarray(
          prgOffset,
          prgOffset + ROMFile.PRGBankSize
        )
      })
    }

    return banks
  }

  private decodeMapper (flags6: number): ROMMapper {
    const mapperCode = (flags6 >> 4) & 0x0f

    return {
      code: mapperCode,
      name: MapperNames[mapperCode]
    }
  }

  private isValidSignature (compareTo: Uint8Array): boolean {
    return (
      this.signature[0] === compareTo[0] &&
      this.signature[1] === compareTo[1] &&
      this.signature[2] === compareTo[2] &&
      this.signature[3] === compareTo[3]
    )
  }
}
