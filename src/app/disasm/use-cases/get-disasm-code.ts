import { type NESModule } from 'src/nes/types'
import { type DisASMNode } from 'src/nes/components/disasm/types'
import { CPUMemoryMap } from 'src/nes/components/core/memory/consts/memory-map'

interface Request {
  fromAddress?: number
  fromLineNumber?: number
  numOfLines: number
}

type Response = DisASMNode[]

export default class GetDisASMCode {
  private constructor (private readonly nes: NESModule) {}

  execute (request: Request): Response {
    const { fromAddress, fromLineNumber } = request
    const { nesDebugger } = this.nes.getComponents()

    if (nesDebugger === undefined || !nesDebugger.isActive()) {
      throw new Error('NES Debugger has not been loaded.')
    }

    const { disASM } = nesDebugger.getComponents()
    const code = disASM.getCode()

    if (code.getNumOfLines() === 0) {
      throw new Error('Disassembly code has not been parsed yet.')
    }

    if (fromAddress !== undefined || fromLineNumber !== undefined) {
      return disASM.read(request)
    }

    const { cpu } = this.nes.getComponents().control
    const startAddress = this.nes.isPowerOn()
      ? CPUMemoryMap.PRG_ROM_START
      : cpu.getPC()

    return disASM.read({ ...request, fromAddress: startAddress })
  }

  static create (nes: NESModule): GetDisASMCode {
    return new GetDisASMCode(nes)
  }
}
