import LoadDebugger from '../../../../../src/app/debugger/uses-cases/load-debugger'
import GetNumOfLinesOfCode from '../../../../../src/app/disasm/use-cases/get-num-of-lines-of-code'
import LoadDisASMCode from '../../../../../src/app/disasm/use-cases/parse-disasm-code'
import { type NESControlBus } from '../../../../../src/nes/components/core/control-bus/types'
import { type NESMemoryComponent } from '../../../../../src/nes/components/core/memory/types'
import { OpcodeToASM } from '../../../../../src/nes/components/disasm/consts/asm'
import { NES } from '../../../../../src/nes/nes'
import { type NESModule } from '../../../../../src/nes/types'
import { buildPRGWithAllOpcodes, storePRG } from '../../../helpers'

describe('GetNumOfLinesOfCode use case', () => {
  let nes: NESModule
  let control: NESControlBus
  let memory: NESMemoryComponent

  let loadDebugger: LoadDebugger
  let loadDisASMCode: LoadDisASMCode
  let getNumOfLinesOfCode: GetNumOfLinesOfCode

  beforeEach(() => {
    nes = NES.create()
    control = nes.getComponents().control
    memory = control.getComponents().memory

    loadDebugger = LoadDebugger.create(nes)
    loadDisASMCode = LoadDisASMCode.create(nes)
    getNumOfLinesOfCode = GetNumOfLinesOfCode.create(nes)
  })

  test('should execute the GetNumOfLinesOfCode use case', async () => {
    const allOpcodesPRG = buildPRGWithAllOpcodes()
    const numOfPRGLines = Object.keys(OpcodeToASM).length
    const sizeOfPRG = allOpcodesPRG.length
    const aditionalLines = 0x8000 - sizeOfPRG
    const expectedNumOfLines = numOfPRGLines + aditionalLines

    await loadDebugger.execute()
    // load prg without executing loadROM use case
    storePRG(memory, allOpcodesPRG)
    await loadDisASMCode.execute()

    const numOfLines = getNumOfLinesOfCode.execute()

    expect(numOfPRGLines).toBe(151)
    expect(numOfLines).toBe(expectedNumOfLines)
  })

  test('should execute the GetNumOfLinesOfCode use case without prg loaded', async () => {
    const expectedNumOfLines = 0x8000

    await loadDebugger.execute()
    await loadDisASMCode.execute()

    const numOfLines = getNumOfLinesOfCode.execute()

    expect(numOfLines).toBe(expectedNumOfLines)
  })
})
