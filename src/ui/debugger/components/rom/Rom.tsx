import { useROM } from '../../hooks/useROM'

export function Rom (): JSX.Element {
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
