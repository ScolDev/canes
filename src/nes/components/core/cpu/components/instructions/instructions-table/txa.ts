import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Txa extends BaseInstruction {
  readonly name = 'txa'
  readonly AddressingModes: CPUAddrModeTable = {
    0x8a: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const currentXRegister = this.cpu.getRegister(CPURegisters.X)

    this.cpu.setRegister(CPURegisters.A, currentXRegister)
    this.updateStatus(this.cpu.getRegister(CPURegisters.A))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
