import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Tay extends BaseInstruction {
  readonly name = 'tay'
  readonly AddressingModes: CPUAddrModeTable = {
    0xa8: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const currentAccumulator = this.cpu.getRegister(CPURegisters.A)

    this.cpu.setRegister(CPURegisters.Y, currentAccumulator)
    this.updateStatus(this.cpu.getRegister(CPURegisters.Y))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
