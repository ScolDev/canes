import { type DisASMNode } from 'src/nes/disasm/types'

export function DisAsmLine ({ node }: { node: DisASMNode }): JSX.Element {
  const { line } = node

  return (
    <div key={line.address} className="Debugger-disasmLine" role="disasm-line">
      <div className="Debugger-disasmLineAddress" role="disasm-address">
        0x{line.address.toString(16).padStart(4, '0')}
      </div>
      <div className="Debugger-disasmLineBytes" role="disasm-bytes">
        {line.bytes.map(byte => byte.toString(16).padStart(2, '0')).join(' ')}
      </div>
      <div className="Debugger-disasmLineInstruction" role="disasm-instruction">
        {line.asm}
      </div>
    </div>
  )
}
