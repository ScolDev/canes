import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPUFlags } from 'src/nes/core/cpu/consts/flags'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Cpy extends BaseInstruction {
  readonly name = 'cpy'
  readonly AddressingModes: CPUAddrModeTable = {
    0xc0: CPUAddressingModes.Immediate,
    0xc4: CPUAddressingModes.ZeroPage,
    0xcc: CPUAddressingModes.Absolute
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const registerValue = this.cpu.getRegister(CPURegisters.Y)
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)

    const result = 0x100 + registerValue - memoryValue

    this.updateStatus(result, registerValue, memoryValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operandA: number, operandB: number): void {
    const carryFlag = operandA >= operandB ? 1 : 0

    this.alu.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
