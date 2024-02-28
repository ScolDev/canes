/* eslint-disable object-property-newline */

import { CPUAddressingModes } from '../../core/cpu/consts/addressing-modes'
import { type CPUAddrMode } from '../../core/cpu/types'

export const AddressingModeToASM: Record<
CPUAddrMode,
(...args: number[]) => string
> = {
  [CPUAddressingModes.Accumulator]: () => '',
  [CPUAddressingModes.Immediate]: (operand: number) =>
    `#$${Number(operand).toString(16).padStart(2, '0')}`,
  [CPUAddressingModes.ZeroPage]: (operand: number) =>
    `$${Number(operand).toString(16).padStart(2, '0')}`,
  [CPUAddressingModes.ZeroPageX]: (operand: number) =>
    `$${Number(operand).toString(16).padStart(2, '0')}, X`,
  [CPUAddressingModes.ZeroPageY]: (operand: number) =>
    `$${Number(operand).toString(16).padStart(2, '0')}, Y`,
  [CPUAddressingModes.Relative]: (operand: number, address: number) =>
    `$${Number(address + operand + 2)
      .toString(16)
      .padStart(2, '0')}`,
  [CPUAddressingModes.Absolute]: (operand: number) =>
    `$${Number(operand).toString(16).padStart(4, '0')}`,
  [CPUAddressingModes.AbsoluteX]: (operand: number) =>
    `$${Number(operand).toString(16).padStart(4, '0')}, X`,
  [CPUAddressingModes.AbsoluteY]: (operand: number) =>
    `$${Number(operand).toString(16).padStart(4, '0')}, Y`,
  [CPUAddressingModes.Indirect]: (operand: number) =>
    `($${Number(operand).toString(16).padStart(4, '0')})`,
  [CPUAddressingModes.IndexedIndirect]: (operand: number) =>
    `($${Number(operand).toString(16).padStart(2, '0')}, X)`,
  [CPUAddressingModes.IndirectIndexed]: (operand: number) =>
    `($${Number(operand).toString(16).padStart(2, '0')}), Y`,
  [CPUAddressingModes.Implied]: () => ''
}

export const OpcodeToASM: Record<number, string> = {
  0x00: 'brk', 0x01: 'ora', 0x05: 'ora', 0x06: 'asl', 0x08: 'php',
  0x09: 'ora', 0x0a: 'asl', 0x0d: 'ora', 0x0e: 'asl', 0x10: 'bpl',
  0x11: 'ora', 0x15: 'ora', 0x16: 'asl', 0x18: 'clc', 0x19: 'ora',
  0x1d: 'ora', 0x1e: 'asl', 0x20: 'jsr', 0x21: 'and', 0x24: 'bit',
  0x25: 'and', 0x26: 'rol', 0x28: 'plp', 0x29: 'and', 0x2a: 'rol',
  0x2c: 'bit', 0x2d: 'and', 0x2e: 'rol', 0x30: 'bmi', 0x31: 'and',
  0x35: 'and', 0x36: 'rol', 0x38: 'sec', 0x39: 'and', 0x3d: 'and',
  0x3e: 'rol', 0x40: 'rti', 0x41: 'eor', 0x45: 'eor', 0x46: 'lsr',
  0x48: 'pha', 0x49: 'eor', 0x4a: 'lsr', 0x4c: 'jmp', 0x4d: 'eor',
  0x4e: 'lsr', 0x50: 'bvc', 0x51: 'eor', 0x55: 'eor', 0x56: 'lsr',
  0x58: 'cli', 0x59: 'eor', 0x5d: 'eor', 0x5e: 'lsr', 0x60: 'rts',
  0x61: 'adc', 0x65: 'adc', 0x66: 'ror', 0x68: 'pla', 0x69: 'adc',
  0x6a: 'ror', 0x6c: 'jmp', 0x6d: 'adc', 0x6e: 'ror', 0x70: 'bvs',
  0x71: 'adc', 0x75: 'adc', 0x76: 'ror', 0x78: 'sei', 0x79: 'adc',
  0x7d: 'adc', 0x7e: 'ror', 0x81: 'sta', 0x84: 'sty', 0x85: 'sta',
  0x86: 'stx', 0x88: 'dey', 0x8a: 'txa', 0x8c: 'sty', 0x8d: 'sta',
  0x8e: 'stx', 0x90: 'bcc', 0x91: 'sta', 0x94: 'sty', 0x95: 'sta',
  0x96: 'stx', 0x98: 'tya', 0x99: 'sta', 0x9a: 'txs', 0x9d: 'sta',
  0xa0: 'ldy', 0xa1: 'lda', 0xa2: 'ldx', 0xa4: 'ldy', 0xa5: 'lda',
  0xa6: 'ldx', 0xa8: 'tay', 0xa9: 'lda', 0xaa: 'tax', 0xac: 'ldy',
  0xad: 'lda', 0xae: 'ldx', 0xb0: 'bcs', 0xb1: 'lda', 0xb4: 'ldy',
  0xb5: 'lda', 0xb6: 'ldx', 0xb8: 'clv', 0xb9: 'lda', 0xba: 'tsx',
  0xbc: 'ldy', 0xbd: 'lda', 0xbe: 'ldx', 0xc0: 'cpy', 0xc1: 'cmp',
  0xc4: 'cpy', 0xc5: 'cmp', 0xc6: 'dec', 0xc8: 'iny', 0xc9: 'cmp',
  0xca: 'dex', 0xcc: 'cpy', 0xcd: 'cmp', 0xce: 'dec', 0xd0: 'bne',
  0xd1: 'cmp', 0xd5: 'cmp', 0xd6: 'dec', 0xd8: 'cld', 0xd9: 'cmp',
  0xdd: 'cmp', 0xde: 'dec', 0xe0: 'cpx', 0xe1: 'sbc', 0xe4: 'cpx',
  0xe5: 'sbc', 0xe6: 'inc', 0xe8: 'inx', 0xe9: 'sbc', 0xea: 'nop',
  0xec: 'cpx', 0xed: 'sbc', 0xee: 'inc', 0xf0: 'beq', 0xf1: 'sbc',
  0xf5: 'sbc', 0xf6: 'inc', 0xf8: 'sed', 0xf9: 'sbc', 0xfd: 'sbc',
  0xfe: 'inc'
}
