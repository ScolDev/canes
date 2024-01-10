import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Adc extends BaseInstruction {
  readonly name = 'adc'
  readonly AddressingModes: CPUAddrModeTable = {
    0x69: CPUAddressingModes.Immediate,
    0x65: CPUAddressingModes.ZeroPage,
    0x75: CPUAddressingModes.ZeroPageX,
    0x6d: CPUAddressingModes.Absolute,
    0x7d: CPUAddressingModes.AbsoluteX,
    0x79: CPUAddressingModes.AbsoluteY,
    0x61: CPUAddressingModes.IndexedIndirect,
    0x71: CPUAddressingModes.IndirectIndexed
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const carryFlag = this.cpuALU.getFlag(CPUFlags.CarryFlag)
    const operandA = this.memory.loadByAddressingMode(addressingMode, operand)
    const operandB = this.cpu.getRegister(CPURegisters.A)

    const result = this.cpu.getRegister(CPURegisters.A) + operandA + carryFlag
    this.cpu.setRegister(CPURegisters.A, result & 0xff)

    this.updateStatus(result, operandA, operandB)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operandA: number, operandB: number): void {
    const carryFlag = result > 0xff ? 1 : 0

    this.cpuALU.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
    this.cpuALU.updateOverflowFlag(result, operandA, operandB)
  }
}
