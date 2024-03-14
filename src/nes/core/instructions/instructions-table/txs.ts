import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Txs extends BaseInstruction {
  readonly name = 'txs'
  readonly AddressingModes: CPUAddrModeTable = {
    0x9a: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const currentXRegister = this.cpu.getRegister(CPURegisters.X)

    this.cpu.setRegister(CPURegisters.SP, currentXRegister)
    this.updateStatus(this.cpu.getRegister(CPURegisters.SP))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
