import GetDisASMCode from 'src/app/disasm/use-cases/get-disasm-code'
import GetNumOfLinesOfCode from 'src/app/disasm/use-cases/get-num-of-lines-of-code'
import { type DisASMNode } from 'src/nes/disasm/types'
import { type NESModule } from 'src/nes/types'

export interface DebuggerQueryHandler {
  getDisASMCode: (request: {
    fromAddress?: number
    fromLineNumber?: number
    numOfLines: number
  }) => DisASMNode[]
  getNumOfLinesOfCode: () => number
}

export function useDebuggerQuery (nes: NESModule): DebuggerQueryHandler {
  const getNumOfLineOfCodeUseCase = GetNumOfLinesOfCode.create(nes)
  const getDisASMCodeUseCase = GetDisASMCode.create(nes)

  const getNumOfLinesOfCode = (): number => {
    return getNumOfLineOfCodeUseCase.execute()
  }

  const getDisASMCode = (request: {
    fromAddress?: number
    fromLineNumber?: number
    numOfLines: number
  }): DisASMNode[] => {
    return getDisASMCodeUseCase.execute(request)
  }

  return {
    getDisASMCode,
    getNumOfLinesOfCode
  }
}
