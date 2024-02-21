import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Asl extends BaseInstruction {
  readonly name = 'asl'
  readonly AddressingModes: CPUAddrModeTable = {
    0x0a: CPUAddressingModes.Accumulator,
    0x06: CPUAddressingModes.ZeroPage,
    0x16: CPUAddressingModes.ZeroPageX,
    0x0e: CPUAddressingModes.Absolute,
    0x1e: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const operandValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const result = (operandValue << 1) & 0xff

    this.memory.storeByAddressingMode(addressingMode, result, operand)
    this.updateStatus(result, operandValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operandValue: number): void {
    const carryFlag = this.alu.getBitValue(7, operandValue)

    this.alu.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
