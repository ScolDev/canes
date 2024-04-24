import { render, screen, getByRole, getAllByRole } from '@testing-library/react'
import user from '@testing-library/user-event'
import { Debugger } from 'src/ui/debugger/Debugger'
import { createROMLoader } from 'tests/integration/helpers'

async function createROMFile (): Promise<File> {
  const romLoader = createROMLoader()
  const blobFile = new Blob([await romLoader.getBytes()])

  return new File([blobFile], 'test-rom.nes')
}

describe('Debugger component tests', () => {
  beforeEach(() => {
    render(<Debugger />)
  })

  test('should load debugger by loading a ROM .nes file', async () => {
    const romFile = await createROMFile()
    const input = screen.getByRole<HTMLInputElement>('rom-file', { hidden: true })

    await user.upload(input, romFile)
    const disASM = await screen.findByRole('disasm')
    const lines = getAllByRole(disASM, 'disasm-line')
    const file = input.files !== null ? input.files[0] : null

    expect(file).toBe(romFile)
    expect(input.files?.length).toBe(1)
    expect(input.files?.item(0)).toBe(romFile)

    expect(disASM).toBeDefined()
    expect(getByRole(lines[0], 'disasm-address')).toBeDefined()
    expect(getByRole(lines[0], 'disasm-bytes')).toBeDefined()
    expect(getByRole(lines[0], 'disasm-instruction')).toBeDefined()
  })
})
