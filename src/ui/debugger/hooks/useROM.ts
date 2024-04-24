import { useEffect, useRef } from 'react'
import { ROMFileLoader } from '../adapters/rom-file-loader'
import { useDebuggerContext } from '../DebuggerContextProvider'

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
