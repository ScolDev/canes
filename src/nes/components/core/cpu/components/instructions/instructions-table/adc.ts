import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Adc extends BaseInstruction {
  readonly name = 'adc'
  readonly opcodesWithExtraCycles = [0x7d, 0x79, 0x71]
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
    const carryFlag = this.alu.getFlag(CPUFlags.CarryFlag)
    const operandA = this.memory.loadByAddressingMode(addressingMode, operand)
    const operandB = this.cpu.getRegister(CPURegisters.A)

    const result = this.cpu.getRegister(CPURegisters.A) + operandA + carryFlag
    this.cpu.setRegister(CPURegisters.A, result & 0xff)

    this.addInstructionExtraCycles(addressingMode, opcode, operand)
    this.updateStatus(result, operandA, operandB)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operandA: number, operandB: number): void {
    const carryFlag = result > 0xff ? 1 : 0

    this.alu.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
    this.alu.updateOverflowFlag(result, operandA, operandB)
  }
}
