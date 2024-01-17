import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Bvs extends BaseInstruction {
  readonly name = 'bvs'
  readonly AddressingModes: CPUAddrModeTable = {
    0x70: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const overflowFlag = this.cpuALU.getFlag(CPUFlags.OverflowFlag)
    let displacement = 0x00

    if (overflowFlag === 0x01) {
      displacement = this.cpuALU.getSignedByte(operand)
      this.addBranchExtraCycles(displacement)
    }

    this.cpu.nextPC(addressingMode, displacement)
  }
}
