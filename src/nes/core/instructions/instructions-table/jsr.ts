import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Jsr extends BaseInstruction {
  readonly name = 'jsr'
  readonly AddressingModes: CPUAddrModeTable = {
    0x20: CPUAddressingModes.Absolute
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const addressValue = this.memory.loadAddressByAddressingMode(addressingMode, operand)
    const currentPC = this.cpu.getRegister(CPURegisters.PC)
    const newStackPointer = this.cpu.getRegister(CPURegisters.SP) - 2
    const stackMemoryAddress = (this.cpu.getRegister(CPURegisters.SP) - 1) + 0x100

    this.cpu.setRegister(CPURegisters.SP, newStackPointer)
    this.memory.storeWord(stackMemoryAddress, currentPC + 2)
    this.cpu.setPC(addressValue)
  }
}
