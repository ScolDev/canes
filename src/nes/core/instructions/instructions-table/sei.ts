import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPUFlags } from 'src/nes/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Sei extends BaseInstruction {
  readonly name = 'sei'
  readonly AddressingModes: CPUAddrModeTable = {
    0x78: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.alu.setFlag(CPUFlags.InterruptDisable)
    this.cpu.nextPC(addressingMode)
  }
}
