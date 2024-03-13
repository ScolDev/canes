import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Bcc extends BaseInstruction {
  readonly name = 'bcc'
  readonly AddressingModes: CPUAddrModeTable = {
    0x90: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const carryFlag = this.alu.getFlag(CPUFlags.CarryFlag)
    let displacement = 0x00

    if (carryFlag === 0x00) {
      displacement = this.alu.getSignedByte(operand)
      this.addBranchExtraCycles(displacement)
    }

    this.cpu.nextPC(addressingMode, displacement)
  }
}
