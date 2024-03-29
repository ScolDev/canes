import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Ldy extends BaseInstruction {
  readonly name = 'ldy'
  readonly opcodesWithExtraCycles = [0xbc]
  readonly AddressingModes: CPUAddrModeTable = {
    0xa0: CPUAddressingModes.Immediate,
    0xa4: CPUAddressingModes.ZeroPage,
    0xb4: CPUAddressingModes.ZeroPageX,
    0xac: CPUAddressingModes.Absolute,
    0xbc: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)

    this.addInstructionExtraCycles(addressingMode, opcode, operand)
    this.cpu.setRegister(CPURegisters.Y, memoryValue)
    this.updateStatus(this.cpu.getRegister(CPURegisters.Y))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
