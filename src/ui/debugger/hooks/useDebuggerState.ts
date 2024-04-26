import { useReducer, type Reducer } from 'react'
import { type ROMLoader } from 'src/nes/rom/types'
import {
  DEBUG_ACTION_CONNECTED,
  DEBUG_ACTION_CONNECTING,
  type DebugAction
} from '../consts/actions'
import { DEBUG_STATE_CONNECTED, DEBUG_STATE_CONNECTING } from '../consts/state'

export interface ROMFile {
  file: ROMLoader
  name: string
  size: number
}

interface DebuggerDisconnected {
  status: 'disconnected'
}

interface DebuggerConnecting {
  status: 'connecting'
}

interface DebuggerConnected {
  status: 'connected'
  rom: ROMFile
}

export type DebugState =
  | DebuggerDisconnected
  | DebuggerConnecting
  | DebuggerConnected

export type DebugDispatch = React.Dispatch<DebugAction>

const initialState: DebugState = {
  status: 'disconnected'
}

const debugReducer: Reducer<DebugState, DebugAction> = (state, action) => {
  switch (action.type) {
    case DEBUG_ACTION_CONNECTED:
      return { status: DEBUG_STATE_CONNECTED, rom: action.rom }
    case DEBUG_ACTION_CONNECTING:
      return { status: DEBUG_STATE_CONNECTING }
    default:
      return state
  }
}

export function useDebuggerState (): {
  state: DebugState
  dispatch: DebugDispatch
} {
  const [state, dispatch] = useReducer(debugReducer, initialState)

  return {
    state,
    dispatch
  }
}
