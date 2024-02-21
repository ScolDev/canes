import { type NESControlBus } from '../core/control-bus/types'
import { type NESInstructionComponent } from '../core/cpu/types'
import {
  type CodeRange,
  type DisASMLine,
  type NESDisASMComponent
} from './types'

export default class DisASM implements NESDisASMComponent {
  private readonly instruction: NESInstructionComponent

  private constructor (private readonly control: NESControlBus) {
    this.instruction = this.control.getComponents().instruction
  }

  read ({ start, numOfLines }: CodeRange): DisASMLine[] {
    let address = start
    const lines: DisASMLine[] = []

    for (let line = 0; line < numOfLines; line++) {
      const instBytes = this.instruction.fetchInstructionBytes(address)
      const size = this.instruction.getInstructionSize(instBytes[0])
      const asm = this.instruction.getInstructionASM(instBytes, address)

      address += size
      lines.push({ asm, address, bytes: instBytes })
    }

    return lines
  }

  static create (control: NESControlBus): NESDisASMComponent {
    return new DisASM(control)
  }
}
