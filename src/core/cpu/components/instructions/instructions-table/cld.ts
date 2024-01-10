import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Cld extends BaseInstruction {
  readonly name = 'cld'
  readonly AddressingModes: CPUAddrModeTable = {
    0xd8: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.cpuALU.clearFlag(CPUFlags.DecimalModeFlag)
    this.cpu.nextPC(addressingMode)
  }
}
