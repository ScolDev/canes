import { DebuggerContextProvider } from './DebuggerContextProvider'
import { DebuggerLayout } from './components/layouts/debugger-layout/DebuggerLayout'

export function Debugger (): JSX.Element {
  return (
    <DebuggerContextProvider>
      <DebuggerLayout />
    </DebuggerContextProvider>
  )
}
