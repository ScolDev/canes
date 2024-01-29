import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Rol extends BaseInstruction {
  readonly name = 'rol'
  readonly AddressingModes: CPUAddrModeTable = {
    0x2a: CPUAddressingModes.Accumulator,
    0x26: CPUAddressingModes.ZeroPage,
    0x36: CPUAddressingModes.ZeroPageX,
    0x2e: CPUAddressingModes.Absolute,
    0x3e: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const operandValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const carryFlag = this.cpuALU.getFlag(CPUFlags.CarryFlag)

    const result = ((operandValue << 1) + carryFlag) & 0xff

    this.memory.storeByAddressingMode(addressingMode, result, operand)
    this.updateStatus(result, operandValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operandValue: number): void {
    const carryFlag = this.cpuALU.getBitValue(7, operandValue)

    this.cpuALU.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }
}
