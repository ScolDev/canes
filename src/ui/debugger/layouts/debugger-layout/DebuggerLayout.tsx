import { useDebuggerContext } from 'src/ui/debugger/DebuggerContextProvider'
import { type DebugState } from 'src/ui/debugger/hooks/useDebuggerState'

import './DebuggerLayout.css'
import { DisconnectedWindow } from '../../windows/disconnected-window/DisconnectedWindow'
import { MainDebuggerWindow } from '../../windows/main-debugger-window/MainDebuggerWindow'

function getDebuggerLayout ({ status }: DebugState): React.JSX.Element {
  switch (status) {
    case 'disconnected':
      return <DisconnectedWindow />
    case 'connected':
      return <MainDebuggerWindow />
    case 'connecting':
      return <h2>Loading disassembly code...</h2>
    default:
      return <h2>Cannot load the view.</h2>
  }
}

export function DebuggerLayout (): JSX.Element {
  const { state } = useDebuggerContext()
  const currentLayout = getDebuggerLayout(state)

  return <main className="DebuggerLayout">{currentLayout}</main>
}
