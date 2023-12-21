import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Stx extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0x86: CPUAddressingModes.ZeroPage,
    0x96: CPUAddressingModes.ZeroPageY,
    0x8e: CPUAddressingModes.Absolute
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const xRegister = this.cpu.getRegister(CPURegisters.X)

    this.memory.storeByAddressingMode(addressingMode, xRegister, operand)
    this.cpu.nextPC(addressingMode)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `stx${getASMByAddrMode(addressingMode, operand)}`
  }
}
