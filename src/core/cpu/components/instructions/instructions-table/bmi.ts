import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Bmi extends BaseInstruction {
  readonly name = 'bmi'
  readonly AddressingModes: CPUAddrModeTable = {
    0x30: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const negativeFlag = this.cpuALU.getFlag(CPUFlags.NegativeFlag)
    let displacement = 0x00

    if (negativeFlag === 0x01) {
      displacement = this.cpuALU.getSignedByte(operand)
      this.cpuState.clock.lastExtraCycles += 1
    }

    this.cpu.nextPC(addressingMode, displacement)
  }
}
