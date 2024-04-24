import { createContext, useContext } from 'react'
import { useDebugger, type DebuggerContext } from './hooks/useDebugger'

const DebugContext = createContext<DebuggerContext | null>(null)

export function DebuggerContextProvider (props: { children: React.ReactNode }): JSX.Element {
  const debugContext = useDebugger()

  return (
  <DebugContext.Provider value={debugContext}>
  {props.children}
  </DebugContext.Provider>
  )
}

export function useDebuggerContext (): DebuggerContext {
  const context = useContext(DebugContext)

  if (context === null) {
    throw new Error(
      'useDebuggerContext has to be used within <DebuggerContextProvider>'
    )
  }

  return context
}
