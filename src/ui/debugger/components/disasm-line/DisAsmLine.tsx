import { type DisASMNode } from 'src/nes/disasm/types'

import './DisAsmLine.css'

export function DisAsmLine ({ node }: { node: DisASMNode }): JSX.Element {
  const { line } = node

  return (
    <div key={line.address} className="DisAsmLine" role="disasm-line">
      <div className="DisAsmLineAddress" role="disasm-address">
        0x{line.address.toString(16).padStart(4, '0')}
      </div>
      <div className="DisAsmLineBytes" role="disasm-bytes">
        {line.bytes.map(byte => byte.toString(16).padStart(2, '0')).join(' ')}
      </div>
      <div className="DisAsmLineInstruction" role="disasm-instruction">
        {line.asm}
      </div>
    </div>
  )
}
