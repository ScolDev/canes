import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Sed extends BaseInstruction {
  readonly name = 'sed'
  readonly AddressingModes: CPUAddrModeTable = {
    0xf8: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.alu.setFlag(CPUFlags.DecimalModeFlag)
    this.cpu.nextPC(addressingMode)
  }
}
