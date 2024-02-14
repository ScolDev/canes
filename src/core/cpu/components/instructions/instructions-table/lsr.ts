import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Lsr extends BaseInstruction {
  readonly name = 'lsr'
  readonly AddressingModes: CPUAddrModeTable = {
    0x4a: CPUAddressingModes.Accumulator,
    0x46: CPUAddressingModes.ZeroPage,
    0x56: CPUAddressingModes.ZeroPageX,
    0x4e: CPUAddressingModes.Absolute,
    0x5e: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const operandValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const result = (operandValue >> 1) & 0xff

    this.memory.storeByAddressingMode(addressingMode, result, operand)
    this.updateStatus(result, operandValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operandValue: number): void {
    const carryFlag = this.alu.getBitValue(0, operandValue)

    this.alu.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
