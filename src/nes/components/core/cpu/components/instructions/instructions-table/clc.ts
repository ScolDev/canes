import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Clc extends BaseInstruction {
  readonly name = 'clc'
  readonly AddressingModes: CPUAddrModeTable = {
    0x18: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.alu.clearFlag(CPUFlags.CarryFlag)
    this.cpu.nextPC(addressingMode)
  }
}
