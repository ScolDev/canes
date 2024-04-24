import {
  type Reducer,
  useReducer,
  useRef,
  createContext,
  useContext,
  useEffect
} from 'react'
import './Debugger.css'
import NESService from 'src/app/nes/services/nes-service'
import { type ROMLoader } from 'src/nes/rom/types'
import LoadDebugger from 'src/app/debugger/uses-cases/load-debugger'
import LoadROM from 'src/app/nes/use-cases/load-rom'
import ParseDisASMCode from 'src/app/disasm/use-cases/parse-disasm-code'
import GetNumOfLinesOfCode from 'src/app/disasm/use-cases/get-num-of-lines-of-code'
import GetDisASMCode from 'src/app/disasm/use-cases/get-disasm-code'
import { type NESModule } from 'src/nes/types'
import { type DisASMNode } from 'src/nes/disasm/types'

type DebugState = DebuggerDisconnected | DebuggerConnected
interface DebuggerDisconnected {
  status: 'disconnected'
}
interface DebuggerConnected {
  status: 'connected'
  rom: ROMFile
}

interface ROMFile {
  file: ROMLoader
  name: string
  size: number
}

type DebugCommand =
  | {
    name: 'OPEN_ROM'
  }
  | {
    name: 'SET_ROM'
    payload: ROMFile
  }

interface DebugAction {
  type: 'CONNECT'
  rom: ROMFile
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

// ROM

interface ROMFileHandler {
  romFileRef: React.RefObject<HTMLInputElement>
  handleROMFileOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

class ROMFileLoader implements ROMLoader {
  constructor (private readonly romFile: File) {}

  async getBytes (): Promise<Uint8Array> {
    return await new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const result = fileReader.result
        const buffer = new Uint8Array(result as ArrayBuffer)

        resolve(buffer)
      }

      fileReader.onerror = () => {
        reject(new Error('Error laoding the rom file.'))
      }

      fileReader.readAsArrayBuffer(this.romFile)
    })
  }
}

function useROM (): ROMFileHandler {
  const { commandHandler } = useDebuggerContext()
  const romFileRef = useRef<HTMLInputElement>(null)

  const openROM = (): void => {
    romFileRef?.current?.click()
  }

  const handleROMFileOnChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.currentTarget.files !== null) {
      const romFile = e.currentTarget.files[0]
      const { name, size } = romFile
      const romLoader = new ROMFileLoader(romFile)

      commandHandler.execute({
        name: 'SET_ROM',
        payload: {
          name,
          size,
          file: romLoader
        }
      })
    }
  }

  useEffect(() => {
    commandHandler.connect('OPEN_ROM', openROM)
  }, [commandHandler])

  return {
    romFileRef,
    handleROMFileOnChange
  }
}

export function ROM (): JSX.Element {
  const { romFileRef, handleROMFileOnChange } = useROM()

  return (
    <input
      id="Debugger__rom-file"
      ref={romFileRef}
      hidden
      accept=".nes"
      role="rom-file"
      style={{ display: 'none' }}
      type="file"
      onChange={handleROMFileOnChange}
    />
  )
}

// Retornar sucriptor para adminstrar los subscriptores del debugger
interface DebuggerContextType {
  state: DebugState
  commandHandler: DebuggerCommandHandler
  queryHandler: DebuggerQueryHandler
}

interface DebuggerCommandHandler {
  execute: (command: DebugCommand) => void
  connect: (key: string, handler: DebuggerHandler) => void
}

type DebuggerHandler = () => void

function useDebuggerCommandHandler (
  nes: NESModule,
  debuggerDispatch: React.Dispatch<DebugAction>
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

interface DebuggerQueryHandler {
  getDisASMCode: (request: {
    fromAddress?: number
    fromLineNumber?: number
    numOfLines: number
  }) => DisASMNode[]
  getNumOfLinesOfCode: () => number
}

function useDebuggerQueryHandler (nes: NESModule): DebuggerQueryHandler {
  const getNumOfLineOfCodeUseCase = GetNumOfLinesOfCode.create(nes)
  const getDisASMCodeUseCase = GetDisASMCode.create(nes)

  const getNumOfLinesOfCode = (): number => {
    return getNumOfLineOfCodeUseCase.execute()
  }

  const getDisASMCode = (request: {
    fromAddress?: number
    fromLineNumber?: number
    numOfLines: number
  }): DisASMNode[] => {
    return getDisASMCodeUseCase.execute(request)
  }

  return {
    getDisASMCode,
    getNumOfLinesOfCode
  }
}

function useDebugger (): DebuggerContextType {
  const [state, dispatch] = useReducer(debugReducer, initialState)

  const nes = NESService.loadNES()
  const commandHandler = useDebuggerCommandHandler(nes, dispatch)
  const queryHandler = useDebuggerQueryHandler(nes)

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

const DebuggerContext = createContext<DebuggerContextType | null>(null)

function useDebuggerContext (): DebuggerContextType {
  const context = useContext(DebuggerContext)

  if (context === null) {
    throw new Error(
      'useDebuggerContext has to be used within <DebuggerContext.Provider>'
    )
  }

  return context
}

export function Debugger (): JSX.Element {
  const debuggerContext = useDebugger()
  const { state, commandHandler, queryHandler } = debuggerContext

  let lines: DisASMNode[] = []
  if (state.status === 'connected') {
    // numOfLinesOfCode = queryHandler.getNumOfLinesOfCode()
    lines = queryHandler.getDisASMCode({
      numOfLines: 100
    })
  }

  return (
    <DebuggerContext.Provider value={debuggerContext}>
      <main className="Debugger">
        <ROM />
        <h1>Debugger status: {state.status}</h1>
        <button
          onClick={() => {
            commandHandler.execute({ name: 'OPEN_ROM' })
          }}
        >
          Load ROM
        </button>
        {state.status === 'connected'
          ? (
          <>
            <section className="Debugger-disasm" role="disasm">
              {lines.map(({ line }) => (
                <div
                  key={line.address}
                  className="Debugger-disasmLine"
                  role="disasm-line"
                >
                  <div
                    className="Debugger-disasmLineAddress"
                    role="disasm-address"
                  >
                    0x{line.address.toString(16).padStart(4, '0')}
                  </div>
                  <div className="Debugger-disasmLineBytes" role="disasm-bytes">
                    {line.bytes.reduce(
                      (bytes, byte) => bytes.concat(Number(byte).toString(16)),
                      ''
                    )}
                  </div>
                  <div
                    className="Debugger-disasmLineInstruction"
                    role="disasm-instruction"
                  >
                    {line.asm}
                  </div>
                </div>
              ))}
            </section>
          </>
            )
          : (
          <h1>Load a .nes ROM file to start.</h1>
            )}
      </main>
    </DebuggerContext.Provider>
  )
}
