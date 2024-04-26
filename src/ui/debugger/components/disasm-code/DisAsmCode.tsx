import { useEffect, useState } from 'react'
import { useDebuggerContext } from '../../DebuggerContextProvider'
import { type DisASMNode } from 'src/nes/disasm/types'
import { DisAsmLine } from '../disasm-line/DisAsmLine'

import './DisAsmCode.css'

interface DisAsmCodeProps {
  linesToLoad?: number
}

export function DisAsmCode ({ linesToLoad = 200 }: DisAsmCodeProps): JSX.Element {
  const { queryHandler } = useDebuggerContext()
  const [lines, setLines] = useState<DisASMNode[]>([])

  useEffect(() => {
    const lines = queryHandler.getDisASMCode({
      numOfLines: linesToLoad
    })

    setLines(lines)
  }, [linesToLoad])

  return (
    <section className="DisAsmCode" role="disasm">
      {lines.map((lineNode) => (
        <DisAsmLine key={lineNode.line.address} node={lineNode} />
      ))}
    </section>
  )
}
