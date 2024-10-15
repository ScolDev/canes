import { DisAsmCode } from 'src/ui/debugger/components/disasm-code/DisAsmCode'
import { Rom } from 'src/ui/debugger/components/rom/Rom'

export function MainDebuggerWindow (): JSX.Element {
  return (
    <>
      <Rom />
      <DisAsmCode />
    </>
  )
}
