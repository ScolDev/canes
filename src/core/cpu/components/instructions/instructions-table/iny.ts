import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Iny extends BaseInstruction {
  readonly name = 'iny'
  readonly AddressingModes: CPUAddrModeTable = {
    0xc8: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const registerValue = this.cpu.getRegister(CPURegisters.Y)
    const resultValue = (registerValue + 1) & 0xff

    this.cpu.setRegister(CPURegisters.Y, resultValue)
    this.updateStatus(resultValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }
}
