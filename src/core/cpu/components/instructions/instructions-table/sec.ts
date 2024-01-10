import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Sec extends BaseInstruction {
  readonly name = 'sec'
  readonly AddressingModes: CPUAddrModeTable = {
    0x38: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.cpuALU.setFlag(CPUFlags.CarryFlag)
    this.cpu.nextPC(addressingMode)
  }
}
