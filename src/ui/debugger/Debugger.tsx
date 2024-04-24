import './Debugger.css'
import { Rom } from './components/rom/Rom'
import { DebuggerContextProvider } from './DebuggerContextProvider'
import { DisASM } from './components/disasm/DisAsm'

export function Debugger (): JSX.Element {
  return (
    <DebuggerContextProvider>
      <main className="Debugger">
        <Rom />
        <DisASM />
      </main>
    </DebuggerContextProvider>
  )
}
