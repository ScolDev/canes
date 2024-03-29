import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Eor extends BaseInstruction {
  readonly name = 'eor'
  readonly opcodesWithExtraCycles = [0x5d, 0x59, 0x51]
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

    this.addInstructionExtraCycles(addressingMode, opcode, operand)
    this.cpu.setRegister(CPURegisters.A, resultValue)
    this.updateStatus(resultValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
