import LoadDebugger from 'src/app/debugger/uses-cases/load-debugger'
import { DebuggerNotLoaded } from 'src/app/disasm/errors/debugger-not-loaded'
import ParseDisASMCode from 'src/app/disasm/use-cases/parse-disasm-code'
import { NES } from 'src/nes/nes'
import ROMService from 'src/nes/services/rom-service'
import { type NESModule } from 'src/nes/types'
import { createROMLoader } from 'tests/integration/helpers'

describe('ParseDisASMCode use case', () => {
  let nes: NESModule
  let loadDebugger: LoadDebugger
  let romService: ROMService
  let parseDisASMCode: ParseDisASMCode

  beforeEach(() => {
    nes = NES.create()

    loadDebugger = LoadDebugger.create(nes)
    romService = ROMService.create(nes, createROMLoader())
    parseDisASMCode = ParseDisASMCode.create(nes)
  })

  test('should execute the ParseDisASMCode use case', async () => {
    const prgSize = 0x8000
    const maxInstructionSize = 3
    const maxInstructionsLines = Math.round(prgSize / maxInstructionSize)
    const expectedFirstLine = {
      line: {
        address: 0x8000,
        asm: '??',
        bytes: [0xff],
        lineNumber: 1,
        instruction: {
          opcode: 0xff,
          operand: undefined,
          supported: false
        }
      }
    }

    await loadDebugger.execute()
    await romService.loadROM()
    await parseDisASMCode.execute()

    const { nesDebugger } = nes.getComponents()
    if (nesDebugger === undefined) {
      throw new DebuggerNotLoaded()
    }

    const { disASM } = nesDebugger.getComponents()
    const code = disASM.getCode()

    expect(code.getNumOfLines()).toBeLessThan(prgSize)
    expect(code.getNumOfLines()).toBeGreaterThan(maxInstructionsLines)

    expect(code.getLineFromLineNumber(1)).toMatchObject(expectedFirstLine)
    expect(code.getLineFromAddress(0x8000)).toMatchObject(expectedFirstLine)

    expect(code.getLineFromAddress(0xe683)).toMatchObject({
      line: {
        address: 0xe683,
        asm: 'sei',
        bytes: [0x78],
        instruction: {
          opcode: 0x78,
          operand: undefined,
          supported: true
        }
      }
    })
    expect(code.getLineFromAddress(0xe684)).toMatchObject({
      line: {
        address: 0xe684,
        asm: 'jmp $eb12',
        bytes: [0x4c, 0x12, 0xeb],
        instruction: {
          opcode: 0x4c,
          operand: 0xeb12,
          supported: true
        }
      }
    })
  })
})
