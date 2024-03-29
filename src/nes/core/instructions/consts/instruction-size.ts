import { CPUAddressingModes } from '../../addressing-modes/consts/addressing-modes'
import { type CPUAddrMode } from '../../addressing-modes/types'

export const CPUInstructionSize: Record<CPUAddrMode, number> = {
  [CPUAddressingModes.Accumulator]: 1,
  [CPUAddressingModes.Immediate]: 2,
  [CPUAddressingModes.ZeroPage]: 2,
  [CPUAddressingModes.ZeroPageX]: 2,
  [CPUAddressingModes.ZeroPageY]: 2,
  [CPUAddressingModes.Relative]: 2,
  [CPUAddressingModes.Absolute]: 3,
  [CPUAddressingModes.AbsoluteX]: 3,
  [CPUAddressingModes.AbsoluteY]: 3,
  [CPUAddressingModes.Indirect]: 3,
  [CPUAddressingModes.IndexedIndirect]: 2,
  [CPUAddressingModes.IndirectIndexed]: 2,
  [CPUAddressingModes.Implied]: 1
}
