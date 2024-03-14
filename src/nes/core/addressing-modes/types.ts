import { type ReverseMap } from 'src/shared/types'
import { type CPUAddressingModes } from './consts/addressing-modes'

export type CPUAddrMode = ReverseMap<typeof CPUAddressingModes>

export interface CPUAddrModeHandler {
  get: (...args: number[]) => number
  set?: (...args: number[]) => void
}
export type CPUAddrModeTable = Record<number, CPUAddrMode>

export interface NESAddrModesComponent {
  get: (addressingMode: CPUAddrMode, operand?: number) => number
  set: (addressingMode: CPUAddrMode, value: number, operand?: number) => void
}
