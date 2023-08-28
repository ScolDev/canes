import And from './and'
import Adc from './adc'
import Asl from './asl'
import Bcc from './bcc'
import Bcs from './bcs'
import Beq from './beq'
import Bit from './bit'
import Bmi from './bmi'
import Bne from './bne'
import Bpl from './bpl'
import Brk from './brk'
import Bvc from './bvc'
import Bvs from './bvs'
import Clc from './clc'
import Cld from './cld'
import Cli from './cli'
import Clv from './clv'
import Cmp from './cmp'
import Cpx from './cpx'
import Cpy from './cpy'
import Dec from './dec'
import Dex from './dex'
import Dey from './dey'
import Eor from './eor'
import Inc from './inc'
import Inx from './inx'
import Iny from './iny'
import Jmp from './jmp'
import Jsr from './jsr'
import Lda from './lda'
import Ldx from './ldx'
import Ldy from './ldy'
import Lsr from './lsr'
import Nop from './nop'
import Ora from './ora'
import Pha from './pha'
import Php from './php'
import Pla from './pla'
import Plp from './plp'
import Rol from './rol'
import Ror from './ror'
import Rti from './rti'
import Rts from './rts'
import Sbc from './sbc'

export default (cpu, cpuALU) => {
  const and = And(cpu, cpuALU)
  const adc = Adc(cpu, cpuALU)
  const asl = Asl(cpu, cpuALU)
  const bcc = Bcc(cpu, cpuALU)
  const bcs = Bcs(cpu, cpuALU)
  const beq = Beq(cpu, cpuALU)
  const bit = Bit(cpu, cpuALU)
  const bmi = Bmi(cpu, cpuALU)
  const bne = Bne(cpu, cpuALU)
  const bpl = Bpl(cpu, cpuALU)
  const brk = Brk(cpu, cpuALU)
  const bvc = Bvc(cpu, cpuALU)
  const bvs = Bvs(cpu, cpuALU)
  const clc = Clc(cpuALU)
  const cld = Cld()
  const cli = Cli(cpuALU)
  const clv = Clv(cpuALU)
  const cmp = Cmp(cpu, cpuALU)
  const cpx = Cpx(cpu, cpuALU)
  const cpy = Cpy(cpu, cpuALU)
  const dec = Dec(cpu, cpuALU)
  const dex = Dex(cpu, cpuALU)
  const dey = Dey(cpu, cpuALU)
  const eor = Eor(cpu, cpuALU)
  const inc = Inc(cpu, cpuALU)
  const inx = Inx(cpu, cpuALU)
  const iny = Iny(cpu, cpuALU)
  const jmp = Jmp(cpu)
  const jsr = Jsr(cpu)
  const lda = Lda(cpu, cpuALU)
  const ldx = Ldx(cpu, cpuALU)
  const ldy = Ldy(cpu, cpuALU)
  const lsr = Lsr(cpu, cpuALU)
  const nop = Nop(cpu)
  const ora = Ora(cpu, cpuALU)
  const pha = Pha(cpu)
  const php = Php(cpu)
  const pla = Pla(cpu, cpuALU)
  const plp = Plp(cpu)
  const rol = Rol(cpu, cpuALU)
  const ror = Ror(cpu, cpuALU)
  const rti = Rti(cpu)
  const rts = Rts(cpu)
  const sbc = Sbc(cpu, cpuALU)

  return {
    0x69: adc,
    0x65: adc,
    0x75: adc,
    0x6d: adc,
    0x7d: adc,
    0x79: adc,
    0x61: adc,
    0x71: adc,
    0x29: and,
    0x25: and,
    0x35: and,
    0x2d: and,
    0x3d: and,
    0x39: and,
    0x21: and,
    0x31: and,
    0x0a: asl,
    0x06: asl,
    0x16: asl,
    0x0e: asl,
    0x1e: asl,
    0x90: bcc,
    0xb0: bcs,
    0xf0: beq,
    0x24: bit,
    0x2c: bit,
    0x30: bmi,
    0xd0: bne,
    0x10: bpl,
    0x00: brk,
    0x50: bvc,
    0x70: bvs,
    0x18: clc,
    0xd8: cld,
    0x58: cli,
    0xb8: clv,
    0xc9: cmp,
    0xc5: cmp,
    0xd5: cmp,
    0xcd: cmp,
    0xdd: cmp,
    0xd9: cmp,
    0xc1: cmp,
    0xd1: cmp,
    0xe0: cpx,
    0xe4: cpx,
    0xec: cpx,
    0xc0: cpy,
    0xc4: cpy,
    0xcc: cpy,
    0xc6: dec,
    0xd6: dec,
    0xce: dec,
    0xde: dec,
    0xca: dex,
    0x88: dey,
    0x49: eor,
    0x45: eor,
    0x55: eor,
    0x4d: eor,
    0x5d: eor,
    0x59: eor,
    0x41: eor,
    0x51: eor,
    0xe6: inc,
    0xf6: inc,
    0xee: inc,
    0xfe: inc,
    0xe8: inx,
    0xc8: iny,
    0x4c: jmp,
    0x6c: jmp,
    0x20: jsr,
    0xa9: lda,
    0xa5: lda,
    0xb5: lda,
    0xad: lda,
    0xbd: lda,
    0xb9: lda,
    0xa1: lda,
    0xb1: lda,
    0xa2: ldx,
    0xa6: ldx,
    0xb6: ldx,
    0xae: ldx,
    0xbe: ldx,
    0xa0: ldy,
    0xa4: ldy,
    0xb4: ldy,
    0xac: ldy,
    0xbc: ldy,
    0x4a: lsr,
    0x46: lsr,
    0x56: lsr,
    0x4e: lsr,
    0x5e: lsr,
    0xea: nop,
    0x09: ora,
    0x05: ora,
    0x15: ora,
    0x0d: ora,
    0x1d: ora,
    0x19: ora,
    0x01: ora,
    0x11: ora,
    0x48: pha,
    0x08: php,
    0x68: pla,
    0x28: plp,
    0x2a: rol,
    0x26: rol,
    0x36: rol,
    0x2e: rol,
    0x3e: rol,
    0x6a: ror,
    0x66: ror,
    0x76: ror,
    0x6e: ror,
    0x7e: ror,
    0x40: rti,
    0x60: rts,
    0xe9: sbc,
    0xe5: sbc,
    0xf5: sbc,
    0xed: sbc,
    0xfd: sbc,
    0xf9: sbc,
    0xe1: sbc,
    0xf1: sbc
  }
}
