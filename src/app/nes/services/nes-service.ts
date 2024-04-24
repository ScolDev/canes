/* eslint-disable @typescript-eslint/no-extraneous-class */
import { NES } from 'src/nes/nes'
import { type NESModule } from 'src/nes/types'

export default class NESService {
  private static nes: NESModule | null = null

  static loadNES (): NESModule {
    if (this.nes === null) {
      this.nes = NES.create()
    }

    return this.nes
  }
}
