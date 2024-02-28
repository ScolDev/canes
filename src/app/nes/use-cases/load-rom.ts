import { ROM } from '../../../nes/components/rom/rom'
import { type ROMLoader } from '../../../nes/components/rom/types'
import { type NESModule } from '../../../nes/types'

export default class LoadROM {
  private constructor (
    private readonly nes: NESModule,
    private readonly romLoader: ROMLoader
  ) {}

  async execute (): Promise<void> {
    const romBytes = await this.romLoader.getBytes()
    const rom = ROM.create(romBytes)

    this.nes.loadROM(rom)
  }

  static create (nes: NESModule, romLoader: ROMLoader): LoadROM {
    return new LoadROM(nes, romLoader)
  }
}
