import ParseDisASMCode from 'src/app/disasm/use-cases/parse-disasm-code'
import LoadROM from 'src/app/nes/use-cases/load-rom'
import { type ROMLoader } from 'src/nes/rom/types'
import { type NESModule } from 'src/nes/types'
import { type DebugAction, type ROMFile } from './useDebugger'

type DebugCommand =
  | {
    name: 'OPEN_ROM'
  }
  | {
    name: 'SET_ROM'
    payload: ROMFile
  }

export interface DebuggerCommandHandler {
  execute: (command: DebugCommand) => void
  connect: (key: string, handler: DebuggerHandler) => void
}

type DebuggerHandler = () => void
type DebuggerDispatch = React.Dispatch<DebugAction>

export function useDebuggerCommand (
  nes: NESModule,
  debuggerDispatch: DebuggerDispatch
): DebuggerCommandHandler {
  const parseDisASMCodeUseCase = ParseDisASMCode.create(nes)

  const handlers = new Map<string, DebuggerHandler>()

  const handleError = (error: Error): void => {
    console.error(error)
  }

  const loadROMHandler = async (romFile: ROMLoader): Promise<void> => {
    const loadROMUseCase = LoadROM.create(nes, romFile)

    await loadROMUseCase.execute()
    await parseDisASMCodeUseCase.execute()
  }

  const connect = (key: string, handler: DebuggerHandler): void => {
    if (handlers.has(key)) {
      return
    }
    handlers.set(key, handler)
  }

  const execute = (command: DebugCommand): void => {
    const handler = handlers.get(command.name)

    if (handler !== undefined) {
      handler()
      return
    }

    switch (command.name) {
      case 'SET_ROM':
        loadROMHandler(command.payload.file)
          .then(async () => {
            debuggerDispatch({
              type: 'CONNECT',
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
    execute
  }
}
