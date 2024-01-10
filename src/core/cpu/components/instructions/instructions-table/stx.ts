import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Stx extends BaseInstruction {
  readonly name = 'stx'
  readonly AddressingModes: CPUAddrModeTable = {
    0x86: CPUAddressingModes.ZeroPage,
    0x96: CPUAddressingModes.ZeroPageY,
    0x8e: CPUAddressingModes.Absolute
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const xRegister = this.cpu.getRegister(CPURegisters.X)

    this.memory.storeByAddressingMode(addressingMode, xRegister, operand)
    this.cpu.nextPC(addressingMode)
  }
}
