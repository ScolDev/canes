import { type NESModule } from 'src/nes/types'

export default class LoadDebugger {
  private constructor (private readonly nes: NESModule) {}

  async execute (): Promise<void> {
    const isPowerOn = this.nes.isPowerOn()
    const nesDebugger = this.nes.debug()

    if (isPowerOn) {
      nesDebugger.pause()
    } else {
      nesDebugger.breakOn({ atResetVector: true })
    }
  }

  static create (nes: NESModule): LoadDebugger {
    return new LoadDebugger(nes)
  }
}
