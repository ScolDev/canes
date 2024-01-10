import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Lda extends BaseInstruction {
  readonly name = 'lda'
  readonly AddressingModes: CPUAddrModeTable = {
    0xa9: CPUAddressingModes.Immediate,
    0xa5: CPUAddressingModes.ZeroPage,
    0xb5: CPUAddressingModes.ZeroPageX,
    0xad: CPUAddressingModes.Absolute,
    0xbd: CPUAddressingModes.AbsoluteX,
    0xb9: CPUAddressingModes.AbsoluteY,
    0xa1: CPUAddressingModes.IndexedIndirect,
    0xb1: CPUAddressingModes.IndirectIndexed
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)

    this.cpu.setRegister(CPURegisters.A, memoryValue)
    this.updateStatus(this.cpu.getRegister(CPURegisters.A))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }
}
