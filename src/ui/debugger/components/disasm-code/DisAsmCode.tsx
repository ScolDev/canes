import { useEffect, useRef, useState } from 'react'
import { useDebuggerContext } from '../../DebuggerContextProvider'
import { type DisASMNode } from 'src/nes/disasm/types'
import { DisAsmLine } from '../disasm-line/DisAsmLine'
import { FixedSizeList as Code } from 'react-window'

import './DisAsmCode.css'

interface LineRowProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DisASMNode[]
  index: number
}

const LineRow = ({ data, index, style }: LineRowProps): JSX.Element => {
  return <DisAsmLine style={style} node={data[index]} />
}

export function DisAsmCode (): JSX.Element {
  const codeRef = useRef<HTMLElement>(null)
  const [codeViewportHeight, setCodeViewportHeight] = useState(0)

  const { queryHandler } = useDebuggerContext()
  const [lines, setLines] = useState<DisASMNode[]>([])

  useEffect(() => {
    const meassureCodeHeight = (): void => {
      if (codeRef.current === null) {
        return
      }

      const height = codeRef.current.getBoundingClientRect().height
      setCodeViewportHeight(height)
    }

    // Measuring the code viewport height
    meassureCodeHeight()
    window.addEventListener('resize', meassureCodeHeight)

    return (): void => {
      window.removeEventListener('resize', meassureCodeHeight)
    }
  }, [lines])

  useEffect(() => {
    const lines = queryHandler.getDisASMCode({ fromLineNumber: 1 })
    setLines(lines)
  }, [])

  if (lines.length === 0) {
    return <h2>Loading...</h2>
  }

  return (
    <section className="DisAsmCode" role="disasm">
      <section ref={codeRef} className="DisAsmCode__code">
        <Code
          height={codeViewportHeight}
          width="100%"
          itemSize={40}
          itemCount={lines.length}
          itemData={lines}
        >
          {LineRow}
        </Code>
      </section>
    </section>
  )
}
