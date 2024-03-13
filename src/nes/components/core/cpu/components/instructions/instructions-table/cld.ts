import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Cld extends BaseInstruction {
  readonly name = 'cld'
  readonly AddressingModes: CPUAddrModeTable = {
    0xd8: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]

    this.alu.clearFlag(CPUFlags.DecimalModeFlag)
    this.cpu.nextPC(addressingMode)
  }
}
