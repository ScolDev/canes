/* eslint-disable @typescript-eslint/no-floating-promises */
import { type NESDebuggerComponent } from '../../../src/nes/components/debugger/types'
import { type NESDisASMComponent } from '../../../src/nes/components/disasm/types'
import { NES } from '../../../src/nes/nes'
import { type NESModule } from '../../../src/nes/types'
import { mapLinesToASM } from '../helpers'

describe('Tests for DisAssembler module', () => {
  let nes: NESModule
  let nesDebugger: NESDebuggerComponent
  let disASM: NESDisASMComponent

  beforeEach(() => {
    nes = NES.create()
    nesDebugger = nes.debug()

    disASM = nesDebugger.getComponents().disASM
  })

  test('should disasm a range of addresses', async () => {
    const filePath = './tests/integration/__nes_roms__/instr_test-v5/rom_singles/01-basics.nes'
    const expectedCode = [
      'sei',
      'jmp $eb12',
      'sei',
      'cld',
      'ldx #$ff',
      'txs',
      'inx',
      'stx $2000',
      'jsr $e6a2',
      'pha',
      'lda #$ff',
      'jsr $e60c',
      'lda #$00',
      'sta $0222',
      'pla'
    ]

    await nes.loadROM({ filePath })
    const lines = disASM.read({ start: 0xe683, numOfLines: 15 })

    expect(lines.length).toBe(15)
    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })
})
