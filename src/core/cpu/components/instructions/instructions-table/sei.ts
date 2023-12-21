import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Sei extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0x78: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.cpuALU.setFlag(CPUFlags.InterruptDisable)
    this.cpu.nextPC(addressingMode)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `sei${getASMByAddrMode(addressingMode, operand)}`
  }
}
