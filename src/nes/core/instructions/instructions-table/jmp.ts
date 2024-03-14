import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Jmp extends BaseInstruction {
  readonly name = 'jmp'
  readonly AddressingModes: CPUAddrModeTable = {
    0x4c: CPUAddressingModes.Absolute,
    0x6c: CPUAddressingModes.Indirect
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const addressValue = this.memory.loadAddressByAddressingMode(addressingMode, operand)

    this.cpu.setPC(addressValue)
  }
}
