import { useDebuggerContext } from '../../DebuggerContextProvider'
import { DisAsmCode } from '../disasm-code/DisAsmCode'

export function DisASM (): JSX.Element {
  const debuggerContext = useDebuggerContext()
  const { state, commandHandler } = debuggerContext

  return (
    <>
      <h1>CaNES: Debugger</h1>
      <h3>Debugger status: {state.status}</h3>
      <button
        onClick={() => {
          commandHandler.execute({ name: 'OPEN_ROM' })
        }}
      >
        Load ROM
      </button>
      {state.status === 'connected' ? <DisAsmCode linesToLoad={100} /> : null}
    </>
  )
}
