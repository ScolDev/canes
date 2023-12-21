import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Jmp extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0x4c: CPUAddressingModes.Absolute,
    0x6c: CPUAddressingModes.Indirect
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const addressValue = this.memory.loadAddressByAddressingMode(addressingMode, operand)

    this.cpu.setPC(addressValue)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `jmp${getASMByAddrMode(addressingMode, operand)}`
  }
}
