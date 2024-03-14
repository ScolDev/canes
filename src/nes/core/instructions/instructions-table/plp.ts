import { CPUAddressingModes } from 'src/nes/core/addressing-modes/consts/addressing-modes'
import { CPURegisters } from 'src/nes/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/core/addressing-modes/types'
import { BaseInstruction } from '../base-instruction'

export class Plp extends BaseInstruction {
  readonly name = 'plp'
  readonly AddressingModes: CPUAddrModeTable = {
    0x28: CPUAddressingModes.Implied
  }

  execute (opcode: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const currentSP = this.cpu.getRegister(CPURegisters.SP)
    const stackMemoryAddress = 0x100 + currentSP
    const memoryValue = this.memory.load(stackMemoryAddress)

    this.cpu.setRegister(CPURegisters.P, memoryValue)
    this.cpu.setRegister(CPURegisters.SP, currentSP + 1)
    this.cpu.nextPC(addressingMode)
  }
}
