import { type NESControlBus } from '../../../src/nes/components/core/control-bus/types'
import { type BaseInstruction } from '../../../src/nes/components/core/cpu/components/instructions/base-instruction'
import { Adc } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/adc'
import { And } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/and'
import { Asl } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/asl'
import { Bcc } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/bcc'
import { Bcs } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/bcs'
import { Beq } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/beq'
import { Bit } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/bit'
import { Bmi } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/bmi'
import { Bne } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/bne'
import { Bpl } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/bpl'
import { Brk } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/brk'
import { Bvc } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/bvc'
import { Bvs } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/bvs'
import { Clc } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/clc'
import { Cld } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/cld'
import { Cli } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/cli'
import { Clv } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/clv'
import { Cmp } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/cmp'
import { Cpx } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/cpx'
import { Cpy } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/cpy'
import { Dec } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/dec'
import { Dex } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/dex'
import { Dey } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/dey'
import { Eor } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/eor'
import { Inc } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/inc'
import { Inx } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/inx'
import { Iny } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/iny'
import { Jmp } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/jmp'
import { Jsr } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/jsr'
import { Lda } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/lda'
import { Ldx } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/ldx'
import { Ldy } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/ldy'
import { Lsr } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/lsr'
import { Nop } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/nop'
import { Ora } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/ora'
import { Pha } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/pha'
import { Php } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/php'
import { Pla } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/pla'
import { Plp } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/plp'
import { Rol } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/rol'
import { Ror } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/ror'
import { Rti } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/rti'
import { Rts } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/rts'
import { Sbc } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/sbc'
import { Sec } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/sec'
import { Sed } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/sed'
import { Sei } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/sei'
import { Sta } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/sta'
import { Stx } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/stx'
import { Sty } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/sty'
import { Tax } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/tax'
import { Tay } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/tay'
import { Tsx } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/tsx'
import { Txa } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/txa'
import { Txs } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/txs'
import { Tya } from '../../../src/nes/components/core/cpu/components/instructions/instructions-table/tya'
import { type NESMemoryComponent } from '../../../src/nes/components/core/memory/types'
import { type NESDebuggerComponent } from '../../../src/nes/components/debugger/types'
import { type NESDisASMComponent } from '../../../src/nes/components/disasm/types'
import { NES } from '../../../src/nes/nes'
import { type NESModule } from '../../../src/nes/types'
import { mapLinesToASM, buildSampleCode, storePRG } from '../helpers'

/* eslint-disable @typescript-eslint/no-floating-promises */
describe('Tests for DisAssembler module', () => {
  let nes: NESModule
  let nesDebugger: NESDebuggerComponent
  let disASM: NESDisASMComponent
  let control: NESControlBus
  let memory: NESMemoryComponent

  beforeEach(() => {
    nes = NES.create()
    nesDebugger = nes.debug()

    disASM = nesDebugger.getComponents().disASM
    control = nes.getComponents().control
    memory = control.getComponents().memory
  })

  test('should disasm a range of addresses', async () => {
    const filePath =
      './tests/integration/__nes_roms__/instr_test-v5/rom_singles/01-basics.nes'
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

    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })

  test('should disassemble ADC, AND, ASL instructions', () => {
    const instructions: BaseInstruction[] = [
      new Adc(control),
      new And(control),
      new Asl(control)
    ]
    const expectedCode = [
      'adc ($12, X)',
      'adc $12',
      'adc #$12',
      'adc $1234',
      'adc ($12), Y',
      'adc $12, X',
      'adc $1234, Y',
      'adc $1234, X',
      'and ($12, X)',
      'and $12',
      'and #$12',
      'and $1234',
      'and ($12), Y',
      'and $12, X',
      'and $1234, Y',
      'and $1234, X',
      'asl $12',
      'asl',
      'asl $1234',
      'asl $12, X',
      'asl $1234, X'
    ]
    const expectedNumOfLines = instructions.reduce(
      (prev, ins) => prev + Object.keys(ins.AddressingModes).length,
      0
    )

    const code = buildSampleCode(instructions)
    storePRG(memory, code)

    const lines = disASM.read({
      start: 0x8000,
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(expectedNumOfLines)
    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })

  test('should disassemble BCC, BCS, BEQ, BIT, BMI, BNE, BPL, BRK, BVC, BVS instructions', () => {
    const instructions: BaseInstruction[] = [
      new Bcc(control),
      new Bcs(control),
      new Beq(control),
      new Bit(control),
      new Bmi(control),
      new Bne(control),
      new Bpl(control),
      new Brk(control),
      new Bvc(control),
      new Bvs(control)
    ]
    const expectedCode = [
      'bcc $8014',
      'bcs $8016',
      'beq $8018',
      'bit $12',
      'bit $1234',
      'bmi $801f',
      'bne $8021',
      'bpl $8023',
      'brk',
      'bvc $8026',
      'bvs $8028'
    ]

    const expectedNumOfLines = instructions.reduce(
      (prev, ins) => prev + Object.keys(ins.AddressingModes).length,
      0
    )

    const code = buildSampleCode(instructions)
    storePRG(memory, code)

    const lines = disASM.read({
      start: 0x8000,
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(expectedNumOfLines)
    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })

  test('should disassemble CLC, CLD, CLI, CLV, CMP, CPX, CPY instructions', () => {
    const instructions: BaseInstruction[] = [
      new Clc(control),
      new Cld(control),
      new Cli(control),
      new Clv(control),
      new Cmp(control),
      new Cpx(control),
      new Cpy(control)
    ]
    const expectedCode = [
      'clc',
      'cld',
      'cli',
      'clv',
      'cmp ($12, X)',
      'cmp $12',
      'cmp #$12',
      'cmp $1234',
      'cmp ($12), Y',
      'cmp $12, X',
      'cmp $1234, Y',
      'cmp $1234, X',
      'cpx #$12',
      'cpx $12',
      'cpx $1234',
      'cpy #$12',
      'cpy $12',
      'cpy $1234'
    ]

    const expectedNumOfLines = instructions.reduce(
      (prev, ins) => prev + Object.keys(ins.AddressingModes).length,
      0
    )

    const code = buildSampleCode(instructions)
    storePRG(memory, code)

    const lines = disASM.read({
      start: 0x8000,
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(expectedNumOfLines)
    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })

  test('should disassemble DEC, DEX, DEY, EOR, INC, INX, INY instructions', () => {
    const instructions: BaseInstruction[] = [
      new Dec(control),
      new Dex(control),
      new Dey(control),
      new Eor(control),
      new Inc(control),
      new Inx(control),
      new Iny(control)
    ]
    const expectedCode = [
      'dec $12',
      'dec $1234',
      'dec $12, X',
      'dec $1234, X',
      'dex',
      'dey',
      'eor ($12, X)',
      'eor $12',
      'eor #$12',
      'eor $1234',
      'eor ($12), Y',
      'eor $12, X',
      'eor $1234, Y',
      'eor $1234, X',
      'inc $12',
      'inc $1234',
      'inc $12, X',
      'inc $1234, X',
      'inx',
      'iny'
    ]

    const expectedNumOfLines = instructions.reduce(
      (prev, ins) => prev + Object.keys(ins.AddressingModes).length,
      0
    )

    const code = buildSampleCode(instructions)
    storePRG(memory, code)

    const lines = disASM.read({
      start: 0x8000,
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(expectedNumOfLines)
    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })

  test('should disassemble JMP, JSR, LDA, LDX, LDY, LSR, NOP instructions', () => {
    const instructions: BaseInstruction[] = [
      new Jmp(control),
      new Dex(control),
      new Jsr(control),
      new Lda(control),
      new Ldx(control),
      new Ldy(control),
      new Lsr(control),
      new Nop(control)
    ]

    const expectedNumOfLines = instructions.reduce(
      (prev, ins) => prev + Object.keys(ins.AddressingModes).length,
      0
    )
    const expectedCode = [
      'jmp $1234',
      'jmp ($1234)',
      'dex',
      'jsr $1234',
      'lda ($12, X)',
      'lda $12',
      'lda #$12',
      'lda $1234',
      'lda ($12), Y',
      'lda $12, X',
      'lda $1234, Y',
      'lda $1234, X',
      'ldx #$12',
      'ldx $12',
      'ldx $1234',
      'ldx $12, Y',
      'ldx $1234, Y',
      'ldy #$12',
      'ldy $12',
      'ldy $1234',
      'ldy $12, X',
      'ldy $1234, X',
      'lsr $12',
      'lsr',
      'lsr $1234',
      'lsr $12, X',
      'lsr $1234, X',
      'nop'
    ]

    const code = buildSampleCode(instructions)
    storePRG(memory, code)

    const lines = disASM.read({
      start: 0x8000,
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(expectedNumOfLines)
    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })

  test('should disassemble ORA, PHA, PHP, PLA, PLP, ROL, ROR, RTI, RTS instructions', () => {
    const instructions: BaseInstruction[] = [
      new Ora(control),
      new Pha(control),
      new Php(control),
      new Pla(control),
      new Plp(control),
      new Rol(control),
      new Ror(control),
      new Rti(control),
      new Rts(control)
    ]

    const expectedNumOfLines = instructions.reduce(
      (prev, ins) => prev + Object.keys(ins.AddressingModes).length,
      0
    )
    const expectedCode = [
      'ora ($12, X)',
      'ora $12',
      'ora #$12',
      'ora $1234',
      'ora ($12), Y',
      'ora $12, X',
      'ora $1234, Y',
      'ora $1234, X',
      'pha',
      'php',
      'pla',
      'plp',
      'rol $12',
      'rol',
      'rol $1234',
      'rol $12, X',
      'rol $1234, X',
      'ror $12',
      'ror',
      'ror $1234',
      'ror $12, X',
      'ror $1234, X',
      'rti',
      'rts'
    ]

    const code = buildSampleCode(instructions)
    storePRG(memory, code)

    const lines = disASM.read({
      start: 0x8000,
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(expectedNumOfLines)
    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })

  test('should disassemble SBC, SEC, SED, SEI, STA, STX, STY, TAX, TAY, TSX, TXA, TXS, TYA instructions', () => {
    const instructions: BaseInstruction[] = [
      new Sbc(control),
      new Sec(control),
      new Sed(control),
      new Sei(control),
      new Sta(control),
      new Stx(control),
      new Sty(control),
      new Tax(control),
      new Tay(control),
      new Tsx(control),
      new Txa(control),
      new Txs(control),
      new Tya(control)
    ]

    const expectedNumOfLines = instructions.reduce(
      (prev, ins) => prev + Object.keys(ins.AddressingModes).length,
      0
    )
    const expectedCode = [
      'sbc ($12, X)',
      'sbc $12',
      'sbc #$12',
      'sbc $1234',
      'sbc ($12), Y',
      'sbc $12, X',
      'sbc $1234, Y',
      'sbc $1234, X',
      'sec',
      'sed',
      'sei',
      'sta ($12, X)',
      'sta $12',
      'sta $1234',
      'sta ($12), Y',
      'sta $12, X',
      'sta $1234, Y',
      'sta $1234, X',
      'stx $12',
      'stx $1234',
      'stx $12, Y',
      'sty $12',
      'sty $1234',
      'sty $12, X',
      'tax',
      'tay',
      'tsx',
      'txa',
      'txs',
      'tya'
    ]

    const code = buildSampleCode(instructions)
    storePRG(memory, code)

    const lines = disASM.read({
      start: 0x8000,
      numOfLines: expectedNumOfLines
    })

    expect(lines.length).toBe(expectedNumOfLines)
    expect(mapLinesToASM(lines)).toEqual(expectedCode)
  })
})
