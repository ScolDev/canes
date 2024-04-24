import { useEffect, useReducer, type Reducer } from 'react'
import { type ROMLoader } from 'src/nes/rom/types'
import {
  type DebuggerCommandHandler,
  useDebuggerCommand
} from './useDebuggerCommand'
import NESService from 'src/app/nes/services/nes-service'
import LoadDebugger from 'src/app/debugger/uses-cases/load-debugger'
import {
  type DebuggerQueryHandler,
  useDebuggerQuery
} from './useDebuggerQuery'

type DebugState = DebuggerDisconnected | DebuggerConnected

interface DebuggerDisconnected {
  status: 'disconnected'
}

interface DebuggerConnected {
  status: 'connected'
  rom: ROMFile
}

export interface ROMFile {
  file: ROMLoader
  name: string
  size: number
}

export interface DebugAction {
  type: 'CONNECT'
  rom: ROMFile
}

export interface DebuggerContext {
  state: DebugState
  commandHandler: DebuggerCommandHandler
  queryHandler: DebuggerQueryHandler
}

const initialState: DebugState = {
  status: 'disconnected'
}

const debugReducer: Reducer<DebugState, DebugAction> = (state, action) => {
  switch (action.type) {
    case 'CONNECT':
      return { status: 'connected', rom: action.rom }
    default:
      return state
  }
}

// TODO: extract state to a new hook useDebuggerState

export function useDebugger (): DebuggerContext {
  const [state, dispatch] = useReducer(debugReducer, initialState)

  const nes = NESService.loadNES()
  const commandHandler = useDebuggerCommand(nes, dispatch)
  const queryHandler = useDebuggerQuery(nes)

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
