import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Sta extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0x85: CPUAddressingModes.ZeroPage,
    0x95: CPUAddressingModes.ZeroPageX,
    0x8d: CPUAddressingModes.Absolute,
    0x9d: CPUAddressingModes.AbsoluteX,
    0x99: CPUAddressingModes.AbsoluteY,
    0x81: CPUAddressingModes.IndexedIndirect,
    0x91: CPUAddressingModes.IndirectIndexed
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const accumulator = this.cpu.getRegister(CPURegisters.A)

    this.memory.storeByAddressingMode(addressingMode, accumulator, operand)
    this.cpu.nextPC(addressingMode)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `sta${getASMByAddrMode(addressingMode, operand)}`
  }
}
