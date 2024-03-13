import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Ldx extends BaseInstruction {
  readonly name = 'ldx'
  readonly opcodesWithExtraCycles = [0xbe]
  readonly AddressingModes: CPUAddrModeTable = {
    0xa2: CPUAddressingModes.Immediate,
    0xa6: CPUAddressingModes.ZeroPage,
    0xb6: CPUAddressingModes.ZeroPageY,
    0xae: CPUAddressingModes.Absolute,
    0xbe: CPUAddressingModes.AbsoluteY
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)

    this.addInstructionExtraCycles(addressingMode, opcode, operand)
    this.cpu.setRegister(CPURegisters.X, memoryValue)
    this.updateStatus(this.cpu.getRegister(CPURegisters.X))
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
