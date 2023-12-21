interface ROMLoaderProps {
  getBytes: () => Promise<Uint8Array>
}

interface ROMFileSource {
  filePath: string
}

export type ROMSource = ROMFileSource

interface ROMHeaderProps {
  numOfPRG: number
  numOfCHR: number
  hasBatteryBacked: boolean
  hasTrainer: boolean
  size: number
  banks: ROMNESBanks
  mapper: ROMMapper
}

export interface ROMBankOffset {
  start: number
}

export type ROMLoader = ROMLoaderProps
export type ROMHeader = ROMHeaderProps | null

export interface ROMBuffer {
  buffer: Uint8Array
  size: number
}
export interface ROMMapper {
  code: number
  name: string
}
export interface ROMBank {
  data: Uint8Array
}

export interface ROMNESBanks {
  prg: ROMBank[]
  chr?: ROMBank[]
}

export interface NESRomModule {
  load: () => Promise<void>
  getHeader: () => ROMHeader
  getPRG: () => ROMBuffer
}

export type NESRom = NESRomModule | undefined
