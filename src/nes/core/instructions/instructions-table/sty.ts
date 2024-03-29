import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Sty extends BaseInstruction {
  readonly name = 'sty'
  readonly AddressingModes: CPUAddrModeTable = {
    0x84: CPUAddressingModes.ZeroPage,
    0x94: CPUAddressingModes.ZeroPageX,
    0x8c: CPUAddressingModes.Absolute
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const yRegister = this.cpu.getRegister(CPURegisters.Y)

    this.memory.storeByAddressingMode(addressingMode, yRegister, operand)
    this.cpu.nextPC(addressingMode)
  }
}
