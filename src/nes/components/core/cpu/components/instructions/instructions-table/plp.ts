import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Plp extends BaseInstruction {
  readonly name = 'plp'
  readonly AddressingModes: CPUAddrModeTable = {
    0x28: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const currentSP = this.cpu.getRegister(CPURegisters.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = this.memory.load(stackMemoryAddress)

    this.cpu.setRegister(CPURegisters.P, memoryValue)
    this.cpu.setRegister(CPURegisters.SP, currentSP + 1)
    this.cpu.nextPC(addressingMode)
  }
}
