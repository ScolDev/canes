import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Tsx extends BaseInstruction {
  readonly name = 'tsx'
  readonly AddressingModes: CPUAddrModeTable = {
    0xba: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const stackPointer = this.cpu.getRegister(CPURegisters.SP)

    this.cpu.setRegister(CPURegisters.X, stackPointer)
    this.updateStatus(this.cpu.getRegister(CPURegisters.X))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }
}
