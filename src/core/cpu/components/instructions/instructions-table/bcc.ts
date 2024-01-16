import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Bcc extends BaseInstruction {
  readonly name = 'bcc'
  readonly AddressingModes: CPUAddrModeTable = {
    0x90: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const carryFlag = this.cpuALU.getFlag(CPUFlags.CarryFlag)
    let displacement = 0x00

    if (carryFlag === 0x00) {
      displacement = this.cpuALU.getSignedByte(operand)
      this.cpuState.clock.lastExtraCycles += 1
    }

    this.cpu.nextPC(addressingMode, displacement)
  }
}
