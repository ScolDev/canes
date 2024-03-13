import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Bit extends BaseInstruction {
  readonly name = 'bit'
  readonly AddressingModes: CPUAddrModeTable = {
    0x24: CPUAddressingModes.ZeroPage,
    0x2c: CPUAddressingModes.Absolute
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const result = this.cpu.getRegister(CPURegisters.A) & memoryValue

    this.updateStatus(result, memoryValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operand: number): void {
    const overflowFlag = this.alu.getBitValue(6, operand)

    this.alu.updateZeroFlag(result)
    this.alu.setFlag(CPUFlags.OverflowFlag, overflowFlag)
    this.alu.updateNegativeFlag(operand)
  }
}
