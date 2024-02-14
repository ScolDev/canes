import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Cli extends BaseInstruction {
  readonly name = 'cli'
  readonly AddressingModes: CPUAddrModeTable = {
    0x58: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.alu.clearFlag(CPUFlags.InterruptDisable)
    this.cpu.nextPC(addressingMode)
  }
}
