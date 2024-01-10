import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Rts extends BaseInstruction {
  readonly name = 'rts'
  readonly AddressingModes: CPUAddrModeTable = {
    0x60: CPUAddressingModes.Implied
  }

  execute (): void {
    const newStackPointer = this.cpu.getRegister(CPURegisters.SP) + 2
    const stackMemoryAddress = this.cpu.getRegister(CPURegisters.SP) + 0x100
    const loadedPC = this.memory.loadWord(stackMemoryAddress + 1)
    const newPC = loadedPC + 1

    this.cpu.setRegister(CPURegisters.SP, newStackPointer)
    this.cpu.setPC(newPC)
  }
}
