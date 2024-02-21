import { type CPUAddrMode } from '../types'

export enum CPUAddressingModes {
  Accumulator,
  Immediate,
  ZeroPage,
  ZeroPageX,
  ZeroPageY,
  Relative,
  Absolute,
  AbsoluteX,
  AbsoluteY,
  Indirect,
  IndexedIndirect,
  IndirectIndexed,
  Implied,
}

export const AddressingModeASM: Record<
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

export const getASMByAddrMode = (
  addressingMode: CPUAddrMode,
  operand?: number,
  address?: number
): string => {
  const addrMode = AddressingModeASM[addressingMode]

  if (
    operand !== undefined &&
    address !== undefined &&
    addressingMode === CPUAddressingModes.Relative
  ) {
    return addrMode(operand, address)
  }

  return operand !== undefined ? addrMode(operand) : addrMode()
}
