import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Ora extends BaseInstruction {
  readonly name = 'ora'
  readonly AddressingModes: CPUAddrModeTable = {
    0x09: CPUAddressingModes.Immediate,
    0x05: CPUAddressingModes.ZeroPage,
    0x15: CPUAddressingModes.ZeroPageX,
    0x0d: CPUAddressingModes.Absolute,
    0x1d: CPUAddressingModes.AbsoluteX,
    0x19: CPUAddressingModes.AbsoluteY,
    0x01: CPUAddressingModes.IndexedIndirect,
    0x11: CPUAddressingModes.IndirectIndexed
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]

    const acumulatorValue = this.cpu.getRegister(CPURegisters.A)
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const resultValue = (acumulatorValue | memoryValue) & 0xff

    this.cpu.setRegister(CPURegisters.A, resultValue)
    this.updateStatus(resultValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }
}
