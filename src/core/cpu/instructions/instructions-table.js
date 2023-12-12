/* eslint-disable object-property-newline */
import { Adc } from './adc'
import { And } from './and'
import { Asl } from './asl'
import { Bcc } from './bcc'
import { Bcs } from './bcs'
import { Beq } from './beq'
import { Bit } from './bit'
import { Bmi } from './bmi'
import { Bne } from './bne'
import { Bpl } from './bpl'
import { Brk } from './brk'
import { Bvc } from './bvc'
import { Bvs } from './bvs'
import { Clc } from './clc'
import { Cld } from './cld'
import { Cli } from './cli'
import { Clv } from './clv'
import { Cmp } from './cmp'
import { Cpx } from './cpx'
import { Cpy } from './cpy'
import { Dec } from './dec'
import { Dex } from './dex'
import { Dey } from './dey'
import { Eor } from './eor'
import { Inc } from './inc'
import { Inx } from './inx'
import { Iny } from './iny'
import { Jmp } from './jmp'
import { Jsr } from './jsr'
import { Lda } from './lda'
import { Ldx } from './ldx'
import { Ldy } from './ldy'
import { Lsr } from './lsr'
import { Nop } from './nop'
import { Ora } from './ora'
import { Pha } from './pha'
import { Php } from './php'
import { Pla } from './pla'
import { Plp } from './plp'
import { Rol } from './rol'
import { Ror } from './ror'
import { Rti } from './rti'
import { Rts } from './rts'
import { Sbc } from './sbc'
import { Sec } from './sec'
import { Sed } from './sed'
import { Sei } from './sei'
import { Sta } from './sta'
import { Stx } from './stx'
import { Sty } from './sty'
import { Tax } from './tax'
import { Tay } from './tay'
import { Tsx } from './tsx'
import { Txa } from './txa'
import { Txs } from './txs'
import { Tya } from './tya'

export default (cpu) => {
  const adc = new Adc(cpu)
  const and = new And(cpu)
  const asl = new Asl(cpu)
  const bcc = new Bcc(cpu)
  const bcs = new Bcs(cpu)
  const beq = new Beq(cpu)
  const bit = new Bit(cpu)
  const bmi = new Bmi(cpu)
  const bne = new Bne(cpu)
  const bpl = new Bpl(cpu)
  const brk = new Brk(cpu)
  const bvc = new Bvc(cpu)
  const bvs = new Bvs(cpu)
  const clc = new Clc(cpu)
  const cld = new Cld(cpu)
  const cli = new Cli(cpu)
  const clv = new Clv(cpu)
  const cmp = new Cmp(cpu)
  const cpx = new Cpx(cpu)
  const cpy = new Cpy(cpu)
  const dec = new Dec(cpu)
  const dex = new Dex(cpu)
  const dey = new Dey(cpu)
  const eor = new Eor(cpu)
  const inc = new Inc(cpu)
  const inx = new Inx(cpu)
  const iny = new Iny(cpu)
  const jmp = new Jmp(cpu)
  const jsr = new Jsr(cpu)
  const lda = new Lda(cpu)
  const ldx = new Ldx(cpu)
  const ldy = new Ldy(cpu)
  const lsr = new Lsr(cpu)
  const nop = new Nop(cpu)
  const ora = new Ora(cpu)
  const pha = new Pha(cpu)
  const php = new Php(cpu)
  const pla = new Pla(cpu)
  const plp = new Plp(cpu)
  const rol = new Rol(cpu)
  const ror = new Ror(cpu)
  const rti = new Rti(cpu)
  const rts = new Rts(cpu)
  const sbc = new Sbc(cpu)
  const sec = new Sec(cpu)
  const sed = new Sed(cpu)
  const sei = new Sei(cpu)
  const sta = new Sta(cpu)
  const stx = new Stx(cpu)
  const sty = new Sty(cpu)
  const tax = new Tax(cpu)
  const tay = new Tay(cpu)
  const tsx = new Tsx(cpu)
  const txa = new Txa(cpu)
  const txs = new Txs(cpu)
  const tya = new Tya(cpu)

  return {
    0x00: brk, 0x01: ora, 0x05: ora, 0x06: asl, 0x08: php,
    0x09: ora, 0x0a: asl, 0x0d: ora, 0x0e: asl, 0x10: bpl,
    0x11: ora, 0x15: ora, 0x16: asl, 0x18: clc, 0x19: ora,
    0x1d: ora, 0x1e: asl, 0x20: jsr, 0x21: and, 0x24: bit,
    0x25: and, 0x26: rol, 0x28: plp, 0x29: and, 0x2a: rol,
    0x2c: bit, 0x2d: and, 0x2e: rol, 0x30: bmi, 0x31: and,
    0x35: and, 0x36: rol, 0x38: sec, 0x39: and, 0x3d: and,
    0x3e: rol, 0x40: rti, 0x41: eor, 0x45: eor, 0x46: lsr,
    0x48: pha, 0x49: eor, 0x4a: lsr, 0x4c: jmp, 0x4d: eor,
    0x4e: lsr, 0x50: bvc, 0x51: eor, 0x55: eor, 0x56: lsr,
    0x58: cli, 0x59: eor, 0x5d: eor, 0x5e: lsr, 0x60: rts,
    0x61: adc, 0x65: adc, 0x66: ror, 0x68: pla, 0x69: adc,
    0x6a: ror, 0x6c: jmp, 0x6d: adc, 0x6e: ror, 0x70: bvs,
    0x71: adc, 0x75: adc, 0x76: ror, 0x78: sei, 0x79: adc,
    0x7d: adc, 0x7e: ror, 0x81: sta, 0x84: sty, 0x85: sta,
    0x86: stx, 0x88: dey, 0x8a: txa, 0x8c: sty, 0x8d: sta,
    0x8e: stx, 0x90: bcc, 0x91: sta, 0x94: sty, 0x95: sta,
    0x96: stx, 0x98: tya, 0x99: sta, 0x9a: txs, 0x9d: sta,
    0xa0: ldy, 0xa1: lda, 0xa2: ldx, 0xa4: ldy, 0xa5: lda,
    0xa6: ldx, 0xa8: tay, 0xa9: lda, 0xaa: tax, 0xac: ldy,
    0xad: lda, 0xae: ldx, 0xb0: bcs, 0xb1: lda, 0xb4: ldy,
    0xb5: lda, 0xb6: ldx, 0xb8: clv, 0xb9: lda, 0xba: tsx,
    0xbc: ldy, 0xbd: lda, 0xbe: ldx, 0xc0: cpy, 0xc1: cmp,
    0xc4: cpy, 0xc5: cmp, 0xc6: dec, 0xc8: iny, 0xc9: cmp,
    0xca: dex, 0xcc: cpy, 0xcd: cmp, 0xce: dec, 0xd0: bne,
    0xd1: cmp, 0xd5: cmp, 0xd6: dec, 0xd8: cld, 0xd9: cmp,
    0xdd: cmp, 0xde: dec, 0xe0: cpx, 0xe1: sbc, 0xe4: cpx,
    0xe5: sbc, 0xe6: inc, 0xe8: inx, 0xe9: sbc, 0xea: nop,
    0xec: cpx, 0xed: sbc, 0xee: inc, 0xf0: beq, 0xf1: sbc,
    0xf5: sbc, 0xf6: inc, 0xf8: sed, 0xf9: sbc, 0xfd: sbc,
    0xfe: inc
  }
}
