import { AddressingModes } from '../addressing-modes/addressing-modes'
import { type NESAddrModesComponent } from '../addressing-modes/types'
import { ALU } from '../alu/alu'
import { type NESAluComponent } from '../alu/types'
import { Instruction } from '../instructions/instruction'
import { CPU } from '../cpu/cpu'
import {
  type NESCpuComponent
} from '../cpu/types'
import { Memory } from '../memory/memory'
import { type NESMemoryComponent } from '../memory/types'
import { type NESComponents, type NESControlBus } from './types'
import { type NESInstructionComponent } from '../instructions/types'

export default class ControlBus implements NESControlBus {
  private readonly _cpu: NESCpuComponent
  private readonly _alu: NESAluComponent
  private readonly _addressingModes: NESAddrModesComponent
  private readonly _instruction: NESInstructionComponent
  private readonly _memory: NESMemoryComponent

  private constructor () {
    this._cpu = CPU.create(this)
    this._alu = ALU.create(this)
    this._instruction = Instruction.create(this)
    this._addressingModes = AddressingModes.create(this)
    this._memory = Memory.create(this)
  }

  getComponents (): NESComponents {
    return {
      cpu: this.cpu,
      alu: this.alu,
      instruction: this.instruction,
      memory: this.memory
    }
  }

  get cpu (): NESCpuComponent {
    return this._cpu
  }

  get alu (): NESAluComponent {
    return this._alu
  }

  get addressingModes (): NESAddrModesComponent {
    return this._addressingModes
  }

  get instruction (): NESInstructionComponent {
    return this._instruction
  }

  get memory (): NESMemoryComponent {
    return this._memory
  }

  static create (): NESControlBus {
    return new ControlBus()
  }
}
