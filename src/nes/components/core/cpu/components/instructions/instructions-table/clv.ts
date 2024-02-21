import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Clv extends BaseInstruction {
  readonly name = 'clv'
  readonly AddressingModes: CPUAddrModeTable = {
    0xb8: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.alu.clearFlag(CPUFlags.OverflowFlag)
    this.cpu.nextPC(addressingMode)
  }
}
