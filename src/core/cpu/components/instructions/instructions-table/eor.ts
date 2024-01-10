import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Eor extends BaseInstruction {
  readonly name = 'eor'
  readonly AddressingModes: CPUAddrModeTable = {
    0x49: CPUAddressingModes.Immediate,
    0x45: CPUAddressingModes.ZeroPage,
    0x55: CPUAddressingModes.ZeroPageX,
    0x4d: CPUAddressingModes.Absolute,
    0x5d: CPUAddressingModes.AbsoluteX,
    0x59: CPUAddressingModes.AbsoluteY,
    0x41: CPUAddressingModes.IndexedIndirect,
    0x51: CPUAddressingModes.IndirectIndexed
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]

    const acumulatorValue = this.cpu.getRegister(CPURegisters.A)
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const resultValue = (acumulatorValue ^ memoryValue) & 0xff

    this.cpu.setRegister(CPURegisters.A, resultValue)
    this.updateStatus(resultValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }
}
