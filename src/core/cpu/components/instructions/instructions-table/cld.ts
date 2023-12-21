import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUInstruction, type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Cld extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0xd8: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.cpuALU.clearFlag(CPUFlags.DecimalModeFlag)
    this.cpu.nextPC(addressingMode)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `cld${getASMByAddrMode(addressingMode, operand)}`
  }
}
