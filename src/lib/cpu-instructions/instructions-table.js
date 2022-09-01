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
    0x70: bvs
  }
}
