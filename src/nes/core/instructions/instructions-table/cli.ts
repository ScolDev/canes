import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPUFlags } from 'src/nes/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
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
