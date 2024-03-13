import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Tax extends BaseInstruction {
  readonly name = 'tax'
  readonly AddressingModes: CPUAddrModeTable = {
    0xaa: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const currentAccumulator = this.cpu.getRegister(CPURegisters.A)

    this.cpu.setRegister(CPURegisters.X, currentAccumulator)
    this.updateStatus(this.cpu.getRegister(CPURegisters.X))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
