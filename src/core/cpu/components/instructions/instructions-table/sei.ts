import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Sei extends BaseInstruction {
  readonly name = 'sei'
  readonly AddressingModes: CPUAddrModeTable = {
    0x78: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.cpuALU.setFlag(CPUFlags.InterruptDisable)
    this.cpu.nextPC(addressingMode)
  }
}
