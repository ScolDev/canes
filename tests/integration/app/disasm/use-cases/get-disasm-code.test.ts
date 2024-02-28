/* eslint-disable @typescript-eslint/no-floating-promises */
import LoadDebugger from '../../../../../src/app/debugger/uses-cases/load-debugger'
import GetDisASMCode from '../../../../../src/app/disasm/use-cases/get-disasm-code'
import LoadDisASMCode from '../../../../../src/app/disasm/use-cases/parse-disasm-code'
import LoadROM from '../../../../../src/app/nes/use-cases/load-rom'
import { NES } from '../../../../../src/nes/nes'
import { type NESModule } from '../../../../../src/nes/types'
import { createROMLoader } from '../../../helpers'

describe('GetDisASMCode use case', () => {
  let nes: NESModule

  beforeEach(() => {
    nes = NES.create()
  })

  test('should execute the GetDisASMCode use case', async () => {
    const expectedNumOfLines = 10
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

    const loadDebugger = LoadDebugger.create(nes)
    const loadROM = LoadROM.create(nes, createROMLoader())
    const loadDisASMCode = LoadDisASMCode.create(nes)
    const getDisASMCode = GetDisASMCode.create(nes)

    await loadDebugger.execute()
    await loadROM.execute()
    await loadDisASMCode.execute()

    const lines = getDisASMCode.execute({
      fromAddress: 0x8000,
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(10)
    expect(lines[9].line.lineNumber).toBe(10)
    expect(lines[0]).toMatchObject(expectedFirstLine)
  })

  test('should execute the GetDisASMCode use case without starting point and NES running', async () => {
    const expectedNumOfLines = 10
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

    const loadDebugger = LoadDebugger.create(nes)
    const loadROM = LoadROM.create(nes, createROMLoader())
    const loadDisASMCode = LoadDisASMCode.create(nes)
    const getDisASMCode = GetDisASMCode.create(nes)

    await loadDebugger.execute()
    await loadROM.execute()
    await loadDisASMCode.execute()

    const lines = getDisASMCode.execute({
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(10)
    expect(lines[9].line.lineNumber).toBe(10)
    expect(lines[0]).toMatchObject(expectedFirstLine)
    expect(nes.isPowerOn()).toBe(true)
  })

  test('should execute the GetDisASMCode use case without starting point and NES paused', (done) => {
    const expectedNumOfLines = 10

    const loadDebugger = LoadDebugger.create(nes)
    const loadROM = LoadROM.create(nes, createROMLoader())
    const loadDisASMCode = LoadDisASMCode.create(nes)
    const getDisASMCode = GetDisASMCode.create(nes)

    loadDebugger.execute()
      .then(async () => {
        await loadROM.execute()
        await loadDisASMCode.execute()

        const nesDebugger = nes.getComponents().nesDebugger
        if (nesDebugger === undefined) {
          throw Error('Debugger is not defined.')
        }
        nesDebugger.pause()

        setTimeout(() => {
          const lines = getDisASMCode.execute({
            numOfLines: expectedNumOfLines
          })

          expect(lines.length).toBe(10)
          expect(nes.isPowerOn()).toBe(false)

          done()
        }, 100)
      })
  })

  test('should throw an Error on GetDisASMCode use case when Debugger has not been loaded.', () => {
    const getDisASMCode = GetDisASMCode.create(nes)

    try {
      getDisASMCode.execute({
        fromAddress: 0x8000,
        numOfLines: 10
      })

      expect(true).toBe(false)
    } catch (error) {
      expect(error instanceof Error).toBe(true)
    }
  })

  test('should throw an Error on GetDisASMCode use case when dissasembly code has not been loaded.', async () => {
    const loadDebugger = LoadDebugger.create(nes)
    const loadROM = LoadROM.create(nes, createROMLoader())
    const getDisASMCode = GetDisASMCode.create(nes)

    try {
      await loadDebugger.execute()
      await loadROM.execute()

      getDisASMCode.execute({
        fromAddress: 0x8000,
        numOfLines: 10
      })

      expect(true).toBe(false)
    } catch (error) {
      expect(error instanceof Error).toBe(true)
    }
  })
})
