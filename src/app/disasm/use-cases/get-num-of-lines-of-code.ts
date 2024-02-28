import { type NESModule } from '../../../nes/types'

export default class GetNumOfLinesOfCode {
  constructor (private readonly nes: NESModule) {}

  execute (): number {
    const nesDebugger = this.nes.getComponents().nesDebugger

    if (nesDebugger === undefined || !nesDebugger.isActive()) {
      throw new Error('Debugger has not been loaded.')
    }

    const { disASM } = nesDebugger.getComponents()
    return disASM.getCode().getNumOfLines()
  }

  static create (nes: NESModule): GetNumOfLinesOfCode {
    return new GetNumOfLinesOfCode(nes)
  }
}
