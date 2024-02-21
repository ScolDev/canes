import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Nop extends BaseInstruction {
  readonly name = 'nop'
  readonly AddressingModes: CPUAddrModeTable = {
    0xea: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    this.cpu.nextPC(addressingMode)
  }
}
