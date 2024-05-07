import { useEffect } from 'react'
import {
  type DebuggerCommandHandler,
  useDebuggerCommand
} from './useDebuggerCommand'
import NESService from 'src/nes/services/nes-service'
import LoadDebugger from 'src/app/debugger/uses-cases/load-debugger'
import {
  type DebuggerQueryHandler,
  useDebuggerQuery
} from './useDebuggerQuery'
import { type DebugState, useDebuggerState } from './useDebuggerState'

export interface DebuggerContext {
  state: DebugState
  commandHandler: DebuggerCommandHandler
  queryHandler: DebuggerQueryHandler
}

export function useDebugger (): DebuggerContext {
  const { state, dispatch } = useDebuggerState()

  const nes = NESService.loadNES()
  const queryHandler = useDebuggerQuery(nes)
  const commandHandler = useDebuggerCommand(nes, dispatch)

  const loadDebuggerUseCase = LoadDebugger.create(nes)

  useEffect(() => {
    loadDebuggerUseCase.execute().catch(console.error)
  }, [])

  return {
    state,
    commandHandler,
    queryHandler
  }
}
