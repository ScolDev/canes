import { type ROMFile } from '../hooks/useDebuggerState'

type OPEN_ROM = 'OPEN_ROM'
type LOAD_ROM = 'LOAD_ROM'
type SET_ROM = 'SET_ROM'

export type DebugCommand =
  | { name: OPEN_ROM }
  | { name: LOAD_ROM }
  | {
    name: SET_ROM
    payload: ROMFile
  }

export type DebugCommandName = OPEN_ROM | LOAD_ROM | SET_ROM

export const DEBUG_COMMAND_OPEN_ROM = 'OPEN_ROM'
export const DEBUG_COMMAND_LOAD_ROM = 'LOAD_ROM'
export const DEBUG_COMMAND_SET_ROM = 'SET_ROM'
