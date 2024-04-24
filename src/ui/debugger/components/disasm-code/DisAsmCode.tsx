import { useEffect, useState } from 'react'
import { useDebuggerContext } from '../../DebuggerContextProvider'
import { type DisASMNode } from 'src/nes/disasm/types'
import { DisAsmLine } from '../disasm-line/DisAsmLine'

interface DisAsmCodeProps {
  linesToLoad: number
}

export function DisAsmCode ({ linesToLoad }: DisAsmCodeProps): JSX.Element {
  const { queryHandler } = useDebuggerContext()
  const [lines, setLines] = useState<DisASMNode[]>([])

  useEffect(() => {
    const lines = queryHandler.getDisASMCode({
      numOfLines: linesToLoad
    })

    setLines(lines)
  }, [linesToLoad])

  return (
    <section className="Debugger-disasm" role="disasm">
      {lines.map((lineNode) => (
        <DisAsmLine key={lineNode.line.address} node={lineNode} />
      ))}
    </section>
  )
}
