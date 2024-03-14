import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPUFlags } from 'src/nes/core/cpu/consts/flags'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Sbc extends BaseInstruction {
  readonly name = 'sbc'
  readonly opcodesWithExtraCycles = [0xfd, 0xf9, 0xf1]
  readonly AddressingModes: CPUAddrModeTable = {
    0xe9: CPUAddressingModes.Immediate,
    0xe5: CPUAddressingModes.ZeroPage,
    0xf5: CPUAddressingModes.ZeroPageX,
    0xed: CPUAddressingModes.Absolute,
    0xfd: CPUAddressingModes.AbsoluteX,
    0xf9: CPUAddressingModes.AbsoluteY,
    0xe1: CPUAddressingModes.IndexedIndirect,
    0xf1: CPUAddressingModes.IndirectIndexed
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const carryFlag = this.alu.getFlag(CPUFlags.CarryFlag)
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const currentAccumulator = this.cpu.getRegister(CPURegisters.A)
    const twoComplement = this.alu.getTwoComplement(memoryValue)

    this.addInstructionExtraCycles(addressingMode, opcode, operand)
    const result = this.cpu.getRegister(CPURegisters.A) + twoComplement + carryFlag
    this.cpu.setRegister(CPURegisters.A, result & 0xff)

    this.updateStatus(result, memoryValue, currentAccumulator)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, memoryValue: number, previousAccumulator: number): void {
    const carryFlag = this.alu.getSignedByte(result) >= 0x00 ? 1 : 0

    this.alu.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
    this.alu.updateOverflowFlag(result, memoryValue, previousAccumulator)
  }
}
