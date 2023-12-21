import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Dec extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0xc6: CPUAddressingModes.ZeroPage,
    0xd6: CPUAddressingModes.ZeroPageX,
    0xce: CPUAddressingModes.Absolute,
    0xde: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const memoryValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const resultValue = (memoryValue - 1) & 0xff

    this.memory.storeByAddressingMode(addressingMode, resultValue, operand)
    this.updateStatus(resultValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number): void {
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `dec${getASMByAddrMode(addressingMode, operand)}`
  }
}
