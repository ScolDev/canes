import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Bvc extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0x50: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const overflowFlag = this.cpuALU.getFlag(CPUFlags.OverflowFlag)
    let displacement = 0x00

    if (overflowFlag === 0x00) {
      displacement = this.cpuALU.getSignedByte(operand)
    }

    this.cpu.nextPC(addressingMode, displacement)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `bvc${getASMByAddrMode(addressingMode, operand)}`
  }
}
