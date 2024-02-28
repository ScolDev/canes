import { CPUMemoryMap } from '../../../nes/components/core/memory/consts/memory-map'
import { type NESModule } from '../../../nes/types'

export default class ParseDisASMCode {
  constructor (private readonly nes: NESModule) {}

  async execute (): Promise<void> {
    const { control, nesDebugger } = this.nes.getComponents()

    if (nesDebugger === undefined || !nesDebugger.isActive()) {
      throw new Error('Debugger has not been loaded.')
    }

    const { disASM } = nesDebugger.getComponents()
    const { memory } = control.getComponents()

    const prg = memory.getMemorySection(
      CPUMemoryMap.PRG_ROM_START,
      CPUMemoryMap.PRG_ROM_END
    )

    disASM.setPRG(prg)
    await disASM.parse()
  }

  static create (nes: NESModule): ParseDisASMCode {
    return new ParseDisASMCode(nes)
  }
}
