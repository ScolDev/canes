import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
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
