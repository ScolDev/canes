import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUInstruction, type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Bmi extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0x30: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const negativeFlag = this.cpuALU.getFlag(CPUFlags.NegativeFlag)
    let displacement = 0x00

    if (negativeFlag === 0x01) {
      displacement = this.cpuALU.getSignedByte(operand)
    }

    this.cpu.nextPC(addressingMode, displacement)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `bmi${getASMByAddrMode(addressingMode, operand)}`
  }
}
