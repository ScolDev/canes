import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
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
    const overflowFlag = this.cpuALU.getBitValue(6, operand)

    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.setFlag(CPUFlags.OverflowFlag, overflowFlag)
    this.cpuALU.updateNegativeFlag(operand)
  }
}
