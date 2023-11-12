export const CPU_ADDRESSING_MODES = {
  Acumulator: 0,
  Immediate: 1,
  ZeroPage: 2,
  ZeroPageX: 3,
  ZeroPageY: 4,
  Relative: 5,
  Absolute: 6,
  AbsoluteX: 7,
  AbsoluteY: 8,
  Indirect: 9,
  IndexedIndirect: 10,
  IndirectIndexed: 11,
  Implied: 12
}

export const AddressingModeSize = new Map([
  [CPU_ADDRESSING_MODES.Acumulator, 0],
  [CPU_ADDRESSING_MODES.Immediate, 1],
  [CPU_ADDRESSING_MODES.ZeroPage, 1],
  [CPU_ADDRESSING_MODES.ZeroPageX, 1],
  [CPU_ADDRESSING_MODES.ZeroPageY, 1],
  [CPU_ADDRESSING_MODES.Relative, 1],
  [CPU_ADDRESSING_MODES.Absolute, 2],
  [CPU_ADDRESSING_MODES.AbsoluteX, 2],
  [CPU_ADDRESSING_MODES.AbsoluteY, 2],
  [CPU_ADDRESSING_MODES.Indirect, 1],
  [CPU_ADDRESSING_MODES.IndexedIndirect, 1],
  [CPU_ADDRESSING_MODES.IndirectIndexed, 1],
  [CPU_ADDRESSING_MODES.Implied, 0]
])

export const AddressingModeASM = new Map([
  [CPU_ADDRESSING_MODES.Acumulator, () => ''],
  [CPU_ADDRESSING_MODES.Immediate, (operand) => ` #$${Number(operand).toString(16).padStart(2, '0')}`],
  [CPU_ADDRESSING_MODES.ZeroPage, (operand) => ` $${Number(operand).toString(16).padStart(2, '0')}`],
  [CPU_ADDRESSING_MODES.ZeroPageX, (operand) => ` $${Number(operand).toString(16).padStart(2, '0')}, X`],
  [CPU_ADDRESSING_MODES.ZeroPageY, (operand) => ` $${Number(operand).toString(16).padStart(2, '0')}, Y`],
  [CPU_ADDRESSING_MODES.Relative, (operand) => ` $${Number(operand).toString(16).padStart(2, '0')}`],
  [CPU_ADDRESSING_MODES.Absolute, (operand) => ` $${Number(operand).toString(16).padStart(4, '0')}`],
  [CPU_ADDRESSING_MODES.AbsoluteX, (operand) => ` $${Number(operand).toString(16).padStart(4, '0')}, X`],
  [CPU_ADDRESSING_MODES.AbsoluteY, (operand) => ` $${Number(operand).toString(16).padStart(4, '0')}, Y`],
  [CPU_ADDRESSING_MODES.Indirect, (operand) => ` ($${Number(operand).toString(16).padStart(4, '0')})`],
  [CPU_ADDRESSING_MODES.IndexedIndirect, (operand) => ` ($${Number(operand).toString(16).padStart(2, '0')}, X)`],
  [CPU_ADDRESSING_MODES.IndirectIndexed, (operand) => ` ($${Number(operand).toString(16).padStart(2, '0')}), Y`],
  [CPU_ADDRESSING_MODES.Implied, () => '']
])

export const getASMByAddrMode = (addressingMode, operand) => {
  return AddressingModeASM.get(addressingMode)(operand)
}
