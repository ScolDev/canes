import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Tya extends BaseInstruction {
  readonly name = 'tya'
  readonly AddressingModes: CPUAddrModeTable = {
    0x98: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const currentYRegister = this.cpu.getRegister(CPURegisters.Y)

    this.cpu.setRegister(CPURegisters.A, currentYRegister)
    this.updateStatus(this.cpu.getRegister(CPURegisters.A))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
