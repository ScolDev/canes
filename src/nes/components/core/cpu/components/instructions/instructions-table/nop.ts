import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
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
