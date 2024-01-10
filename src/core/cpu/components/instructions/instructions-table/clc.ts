import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Clc extends BaseInstruction {
  readonly name = 'clc'
  readonly AddressingModes: CPUAddrModeTable = {
    0x18: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.cpuALU.clearFlag(CPUFlags.CarryFlag)
    this.cpu.nextPC(addressingMode)
  }
}
