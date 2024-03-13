import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Pla extends BaseInstruction {
  readonly name = 'pla'
  readonly AddressingModes: CPUAddrModeTable = {
    0x68: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const currentSP = this.cpu.getRegister(CPURegisters.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = this.memory.load(stackMemoryAddress)

    this.cpu.setRegister(CPURegisters.A, memoryValue)
    this.cpu.setRegister(CPURegisters.SP, currentSP + 1)

    this.updateStatus(memoryValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.alu.updateZeroFlag(result)
    this.alu.updateNegativeFlag(result)
  }
}
