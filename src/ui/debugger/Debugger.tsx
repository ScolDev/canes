import { DebuggerContextProvider } from './DebuggerContextProvider'
import { DebuggerLayout } from './layouts/debugger-layout/DebuggerLayout'

export function Debugger (): JSX.Element {
  return (
    <DebuggerContextProvider>
      <DebuggerLayout />
    </DebuggerContextProvider>
  )
}
