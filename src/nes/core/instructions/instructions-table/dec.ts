import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Dec extends BaseInstruction {
  readonly name = 'dec'
  readonly AddressingModes: CPUAddrModeTable = {
    0xc6: CPUAddressingModes.ZeroPage,
    0xd6: CPUAddressingModes.ZeroPageX,
    0xce: CPUAddressingModes.Absolute,
    0xde: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const resultValue = (memoryValue - 1) & 0xff

    this.memory.storeByAddressingMode(addressingMode, resultValue, operand)
    this.updateStatus(resultValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
