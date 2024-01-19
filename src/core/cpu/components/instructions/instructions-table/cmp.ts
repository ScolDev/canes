import { CPUAddressingModes } from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { CPURegisters } from '../../../consts/registers'
import { type CPUAddrModeTable } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Cmp extends BaseInstruction {
  readonly name = 'cmp'
  readonly opcodesWithExtraCycles = [0xdd, 0xd9, 0xd1]
  readonly AddressingModes: CPUAddrModeTable = {
    0xc9: CPUAddressingModes.Immediate,
    0xc5: CPUAddressingModes.ZeroPage,
    0xd5: CPUAddressingModes.ZeroPageX,
    0xcd: CPUAddressingModes.Absolute,
    0xdd: CPUAddressingModes.AbsoluteX,
    0xd9: CPUAddressingModes.AbsoluteY,
    0xc1: CPUAddressingModes.IndexedIndirect,
    0xd1: CPUAddressingModes.IndirectIndexed
  }

  execute (opcode: number, operand: number): void {
    const { memory } = this.cpu.getComponents()
    const addressingMode = this.AddressingModes[opcode]
    const accumulator = this.cpu.getRegister(CPURegisters.A)
    const memoryValue = memory.loadByAddressingMode(addressingMode, operand)

    const result = 0x100 + accumulator - memoryValue

    this.addInstructionExtraCycles(addressingMode, opcode, operand)
    this.updateStatus(result, accumulator, memoryValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operandA: number, operandB: number): void {
    const carryFlag = operandA >= operandB ? 1 : 0

    this.cpuALU.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }
}
