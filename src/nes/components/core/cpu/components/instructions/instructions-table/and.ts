import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class And extends BaseInstruction {
  readonly name = 'and'
  readonly opcodesWithExtraCycles = [0x3d, 0x39, 0x31]
  readonly AddressingModes: CPUAddrModeTable = {
    0x29: CPUAddressingModes.Immediate,
    0x25: CPUAddressingModes.ZeroPage,
    0x35: CPUAddressingModes.ZeroPageX,
    0x2d: CPUAddressingModes.Absolute,
    0x3d: CPUAddressingModes.AbsoluteX,
    0x39: CPUAddressingModes.AbsoluteY,
    0x21: CPUAddressingModes.IndexedIndirect,
    0x31: CPUAddressingModes.IndirectIndexed
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    this.cpu.setRegister(
      CPURegisters.A,
      this.cpu.getRegister(CPURegisters.A) &
        this.memory.loadByAddressingMode(addressingMode, operand)
    )

    this.addInstructionExtraCycles(addressingMode, opcode, operand)
    this.updateStatus(this.cpu.getRegister(CPURegisters.A))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
