import {
  CPUAddressingModes,
  getASMByAddrMode
} from '../../../consts/addressing-modes'
import { CPUFlags } from '../../../consts/flags'
import { type CPUAddrModeTable, type CPUInstruction } from '../../../types'
import { BaseInstruction } from '../base-instruction'

export class Asl extends BaseInstruction {
  readonly AddressingModes: CPUAddrModeTable = {
    0x0a: CPUAddressingModes.Accumulator,
    0x06: CPUAddressingModes.ZeroPage,
    0x16: CPUAddressingModes.ZeroPageX,
    0x0e: CPUAddressingModes.Absolute,
    0x1e: CPUAddressingModes.AbsoluteX
  }

  execute (opcode: number, operand: number): void {
    const addressingMode = this.AddressingModes[opcode]
    const operandValue = this.memory.loadByAddressingMode(addressingMode, operand)
    const result = (operandValue << 1) & 0xff

    this.memory.storeByAddressingMode(addressingMode, result, operand)
    this.updateStatus(result, operandValue)
    this.cpu.nextPC(addressingMode)
  }

  updateStatus (result: number, operandValue: number): void {
    const carryFlag = this.cpuALU.getBitValue(7, operandValue)

    this.cpuALU.setFlag(CPUFlags.CarryFlag, carryFlag)
    this.cpuALU.updateZeroFlag(result)
    this.cpuALU.updateNegativeFlag(result)
  }

  getASM (instruction: CPUInstruction): string {
    const [opcode, operand] = instruction
    const addressingMode = this.AddressingModes[opcode]
    return `asl${getASMByAddrMode(addressingMode, operand)}`
  }
}
