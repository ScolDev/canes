import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPUFlags } from 'src/nes/core/cpu/consts/flags'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Ror extends BaseInstruction {
  readonly name = 'ror'
  readonly AddressingModes: CPUAddrModeTable = {
    0x6a: CPUAddressingModes.Accumulator,
    0x66: CPUAddressingModes.ZeroPage,
    0x76: CPUAddressingModes.ZeroPageX,
    0x6e: CPUAddressingModes.Absolute,
    0x7e: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const operandValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const carryFlag = this.alu.getFlag(CPUFlags.CarryFlag)

    const result = (operandValue >> 1) + (carryFlag << 7)

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
