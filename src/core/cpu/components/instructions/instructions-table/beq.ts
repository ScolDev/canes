import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Beq extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0xf0: CPUAddressingModes.Relative
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const zeroFlag = this.cpuALU.getFlag(CPUFlags.ZeroFlag)
    let displacement = 0x00

    if (zeroFlag === 0x01) {
      displacement = this.cpuALU.getSignedByte(operand)
    }

    this.cpu.nextPC(addressingMode, displacement)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `beq${getASMByAddrMode(addressingMode, operand)}`
  }
}
