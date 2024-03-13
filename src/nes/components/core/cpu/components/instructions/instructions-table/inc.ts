import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Inc extends BaseInstruction {
  readonly name = 'inc'
  readonly AddressingModes: CPUAddrModeTable = {
    0xe6: CPUAddressingModes.ZeroPage,
    0xf6: CPUAddressingModes.ZeroPageX,
    0xee: CPUAddressingModes.Absolute,
    0xfe: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const resultValue = (memoryValue + 1) & 0xff

    this.memory.storeByAddressingMode(addressingMode, resultValue, operand)
    this.updateStatus(resultValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
