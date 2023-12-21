import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Pha extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0x48: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const accumulator = this.cpu.getRegister(CPURegisters.A)
    const currentSP = this.cpu.getRegister(CPURegisters.SP)

    const stackMemoryAddress = 0x100 + currentSP

    this.memory.store(stackMemoryAddress, accumulator)
    this.cpu.setRegister(CPURegisters.SP, currentSP - 1)
    this.cpu.nextPC(addressingMode)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `pha${getASMByAddrMode(addressingMode, operand)}`
  }
}
