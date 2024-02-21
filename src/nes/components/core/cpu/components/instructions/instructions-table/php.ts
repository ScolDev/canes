import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Php extends BaseInstruction {
  readonly name = 'php'
  readonly AddressingModes: CPUAddrModeTable = {
    0x08: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const processorStatus = this.cpu.getRegister(CPURegisters.P)
    const currentSP = this.cpu.getRegister(CPURegisters.SP)

    const stackMemoryAddress = 0x100 + currentSP

    this.memory.store(stackMemoryAddress, processorStatus)
    this.cpu.setRegister(CPURegisters.SP, currentSP - 1)
    this.cpu.nextPC(addressingMode)
  }
}
