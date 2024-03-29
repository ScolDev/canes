import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Rti extends BaseInstruction {
  readonly name = 'rti'
  readonly AddressingModes: CPUAddrModeTable = {
    0x40: CPUAddressingModes.Implied
  }

  execute (): void {
    const currentSP = this.cpu.getRegister(CPURegisters.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const processorStatus = this.memory.load(stackMemoryAddress)
    const pc = this.memory.loadWord(stackMemoryAddress + 1)

    this.cpu.setRegister(CPURegisters.P, processorStatus)
    this.cpu.setRegister(CPURegisters.SP, currentSP + 2)
    this.cpu.setPC(pc)
  }
}
