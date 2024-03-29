import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPUFlags } from 'src/nes/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Bvs extends BaseInstruction {
  readonly name = 'bvs'
  readonly AddressingModes: CPUAddrModeTable = {
    0x70: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const overflowFlag = this.alu.getFlag(CPUFlags.OverflowFlag)
    let displacement = 0x00

    if (overflowFlag === 0x01) {
      displacement = this.alu.getSignedByte(operand)
      this.addBranchExtraCycles(displacement)
    }

    this.cpu.nextPC(addressingMode, displacement)
  }
}
