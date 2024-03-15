import { type NESModule } from 'src/nes/types'
import { DebuggerNotLoaded } from '../errors/debugger-not-loaded'

export default class GetNumOfLinesOfCode {
  constructor (private readonly nes: NESModule) {}

  execute (): number {
    const nesDebugger = this.nes.getComponents().nesDebugger

    if (nesDebugger === undefined || !nesDebugger.isActive()) {
      throw new DebuggerNotLoaded()
    }

    const { disASM } = nesDebugger.getComponents()
    return disASM.getCode().getNumOfLines()
  }

  static create (nes: NESModule): GetNumOfLinesOfCode {
    return new GetNumOfLinesOfCode(nes)
  }
}
