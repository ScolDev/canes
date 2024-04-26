import { useEffect, useRef } from 'react'
import { ROMFileLoader } from '../adapters/rom-file-loader'
import { useDebuggerContext } from '../DebuggerContextProvider'
import { DEBUG_COMMAND_LOAD_ROM, DEBUG_COMMAND_OPEN_ROM, DEBUG_COMMAND_SET_ROM } from '../consts/commands'

interface ROMFileHandler {
  romFileRef: React.RefObject<HTMLInputElement>
  handleROMFileOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function useROM (): ROMFileHandler {
  const { commandHandler } = useDebuggerContext()
  const romFileRef = useRef<HTMLInputElement>(null)

  const openROM = (): void => {
    romFileRef?.current?.click()
  }

  const handleROMFileOnChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.currentTarget.files !== null) {
      commandHandler.execute({ name: DEBUG_COMMAND_LOAD_ROM })
      const romFile = e.currentTarget.files[0]
      const { name, size } = romFile
      const romLoader = new ROMFileLoader(romFile)

      commandHandler.execute({
        name: DEBUG_COMMAND_SET_ROM,
        payload: {
          name,
          size,
          file: romLoader
        }
      })
    }
  }

  useEffect(() => {
    commandHandler.connect(DEBUG_COMMAND_OPEN_ROM, openROM)

    return () => {
      commandHandler.disconnect(DEBUG_COMMAND_OPEN_ROM)
    }
  }, [commandHandler])

  return {
    romFileRef,
    handleROMFileOnChange
  }
}
