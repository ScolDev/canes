import { ROM } from 'src/nes/rom/rom'
import { type ROMLoader } from 'src/nes/rom/types'
import { type NESModule } from 'src/nes/types'

export default class ROMService {
  private constructor (
    private readonly nes: NESModule,
    private readonly romLoader: ROMLoader
  ) {}

  async loadROM (): Promise<void> {
    const romBytes = await this.romLoader.getBytes()
    const rom = ROM.create(romBytes)

    this.nes.loadROM(rom)
  }

  static create (nes: NESModule, romLoader: ROMLoader): ROMService {
    return new ROMService(nes, romLoader)
  }
}
