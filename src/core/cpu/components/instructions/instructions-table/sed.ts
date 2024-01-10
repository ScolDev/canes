import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Sed extends BaseInstruction {
  readonly name = 'sed'
  readonly AddressingModes: CPUAddrModeTable = {
    0xf8: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.cpuALU.setFlag(CPUFlags.DecimalModeFlag)
    this.cpu.nextPC(addressingMode)
  }
}
