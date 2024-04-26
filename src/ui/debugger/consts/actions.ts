import { type ROMFile } from '../hooks/useDebuggerState'

interface DebugConnectingAction { type: 'DEBUG_CONNECTING' }
interface DebugConnectedAction {
  type: 'DEBUG_CONNECTED'
  rom: ROMFile
}

export type DebugAction = DebugConnectingAction | DebugConnectedAction

export const DEBUG_ACTION_CONNECTING = 'DEBUG_CONNECTING'
export const DEBUG_ACTION_CONNECTED = 'DEBUG_CONNECTED'
