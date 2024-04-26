import { useDebuggerContext } from 'src/ui/debugger/DebuggerContextProvider'
import { Rom } from '../../rom/Rom'
import { DEBUG_COMMAND_OPEN_ROM } from 'src/ui/debugger/consts/commands'

export function DebuggerDisconnectedLayout (): JSX.Element {
  const { state, commandHandler } = useDebuggerContext()

  return (
    <>
      <Rom />
      <h1>CaNES: Debugger</h1>
      <h3>Debugger status: {state.status}</h3>
      <button
        onClick={() => {
          commandHandler.execute({ name: DEBUG_COMMAND_OPEN_ROM })
        }}
      >
        Load ROM
      </button>
    </>
  )
}
