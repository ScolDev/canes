import { DisAsmCode } from '../../disasm-code/DisAsmCode'
import { Rom } from '../../rom/Rom'

export function DebuggerConnectedLayout (): JSX.Element {
  return (
    <>
      <Rom />
      <DisAsmCode />
    </>
  )
}
