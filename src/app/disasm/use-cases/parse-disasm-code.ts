import { CPUMemoryMap } from 'src/nes/core/memory/consts/memory-map'
import { type NESModule } from 'src/nes/types'
import { DebuggerNotLoaded } from '../errors/debugger-not-loaded'

export default class ParseDisASMCode {
  constructor (private readonly nes: NESModule) {}

  async execute (): Promise<void> {
    const { control, nesDebugger } = this.nes.getComponents()

    if (nesDebugger === undefined || !nesDebugger.isActive()) {
      throw new DebuggerNotLoaded()
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
