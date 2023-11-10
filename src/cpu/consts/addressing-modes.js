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
  IndirectIndexed: 11
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
  [CPU_ADDRESSING_MODES.IndirectIndexed, 1]

])
