import ParseDisASMCode from 'src/app/disasm/use-cases/parse-disasm-code'
import { type ROMLoader } from 'src/nes/rom/types'
import ROMService from 'src/nes/services/rom-service'
import { type NESModule } from 'src/nes/types'
import {
  DEBUG_ACTION_CONNECTED,
  DEBUG_ACTION_CONNECTING,
  type DebugAction
} from '../consts/actions'
import {
  DEBUG_COMMAND_LOAD_ROM,
  DEBUG_COMMAND_SET_ROM,
  type DebugCommandName,
  type DebugCommand
} from '../consts/commands'

type DebuggerHandler = () => void
type DebuggerDispatch = React.Dispatch<DebugAction>

export interface DebuggerCommandHandler {
  execute: (command: DebugCommand) => void
  connect: (commandName: DebugCommandName, handler: DebuggerHandler) => void
  disconnect: (commandName: DebugCommandName) => void
}

export function useDebuggerCommand (
  nes: NESModule,
  debuggerDispatch: DebuggerDispatch
): DebuggerCommandHandler {
  const parseDisASMCodeUseCase = ParseDisASMCode.create(nes)

  const handlers = new Map<DebugCommandName, DebuggerHandler>()

  const handleError = (error: Error): void => {
    console.error(error)
  }

  const loadROMHandler = async (romFile: ROMLoader): Promise<void> => {
    const romService = ROMService.create(nes, romFile)

    await romService.loadROM()
    await parseDisASMCodeUseCase.execute()
  }

  const connect = (
    commandName: DebugCommandName,
    handler: DebuggerHandler
  ): void => {
    console.log('connect')
    if (handlers.has(commandName)) {
      return
    }
    handlers.set(commandName, handler)
  }

  const disconnect = (commandName: DebugCommandName): void => {
    console.log('disconnect')
    if (handlers.has(commandName)) {
      return
    }

    handlers.delete(commandName)
  }

  const execute = (command: DebugCommand): void => {
    console.log('execute', command.name)
    const handler = handlers.get(command.name)

    if (handler !== undefined) {
      handler()
      return
    }

    switch (command.name) {
      case DEBUG_COMMAND_LOAD_ROM:
        debuggerDispatch({ type: DEBUG_ACTION_CONNECTING })
        break
      case DEBUG_COMMAND_SET_ROM:
        loadROMHandler(command.payload.file)
          .then(async () => {
            debuggerDispatch({
              type: DEBUG_ACTION_CONNECTED,
              rom: {
                ...command.payload
              }
            })
          })
          .catch(handleError)

        break
    }
  }

  return {
    connect,
    disconnect,
    execute
  }
}
