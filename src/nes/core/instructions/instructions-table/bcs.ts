import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPUFlags } from 'src/nes/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Bcs extends BaseInstruction {
  readonly name = 'bcs'
  readonly AddressingModes: CPUAddrModeTable = {
    0xb0: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const carryFlag = this.alu.getFlag(CPUFlags.CarryFlag)
    let displacement = 0x00

    if (carryFlag === 0x01) {
      displacement = this.alu.getSignedByte(operand)
      this.addBranchExtraCycles(displacement)
    }

    this.cpu.nextPC(addressingMode, displacement)
  }
}
