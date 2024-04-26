import { useDebuggerContext } from 'src/ui/debugger/DebuggerContextProvider'
import { DebuggerConnectedLayout } from '../debugger-connected-layout/DebuggerConnectedLayout'
import { DebuggerDisconnectedLayout } from '../debugger-connected-layout/DebuggerDisconnectedLayout'
import { type DebugState } from 'src/ui/debugger/hooks/useDebuggerState'

import './DebuggerLayout.css'

function getDebuggerLayout ({ status }: DebugState): React.JSX.Element {
  switch (status) {
    case 'disconnected':
      return <DebuggerDisconnectedLayout />
    case 'connected':
      return <DebuggerConnectedLayout />
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
