interface ROMFileSource {
  filePath: string
}

export type ROMSource = ROMFileSource
export interface ROMLoader {
  getBytes: () => Promise<Uint8Array>
}

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

export interface NESRomComponent {
  load: () => Promise<void>
  getHeader: () => ROMHeader
  getPRG: () => ROMBuffer
}

export type NESRom = NESRomComponent | undefined
