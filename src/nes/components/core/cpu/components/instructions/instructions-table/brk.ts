import { CPUMemoryMap } from 'src/nes/components/core/memory/consts/memory-map'
import { CPUAddressingModes } from 'src/nes/components/core/cpu/consts/addressing-modes'
import { CPUFlags } from 'src/nes/components/core/cpu/consts/flags'
import { CPURegisters } from 'src/nes/components/core/cpu/consts/registers'
import { type CPUAddrModeTable } from 'src/nes/components/core/cpu/types'
import { BaseInstruction } from '../base-instruction'

export class Brk extends BaseInstruction {
  readonly name = 'brk'
  readonly AddressingModes: CPUAddrModeTable = {
    0x00: CPUAddressingModes.Implied
  }

  execute (): void {
    const pcl = (this.cpu.getRegister(CPURegisters.PC) & 0xff) + 2
    const pch = (this.cpu.getRegister(CPURegisters.PC) & 0xff00) >> 8
    const irqInterruptVector = this.memory.loadWord(CPUMemoryMap.IRQ_Vector)
    const currentSP = this.cpu.getRegister(CPURegisters.SP)

    this.alu.setFlag(CPUFlags.BreakCommand)

    this.memory.store(CPUMemoryMap.Stack + currentSP, pcl)
    this.memory.store(CPUMemoryMap.Stack + (currentSP - 1), pch)
    this.memory.store(
      CPUMemoryMap.Stack + (currentSP - 2),
      this.cpu.getRegister(CPURegisters.P)
    )

    this.cpu.setRegister(CPURegisters.SP, currentSP - 2)
    this.cpu.setPC(irqInterruptVector)
  }
}
