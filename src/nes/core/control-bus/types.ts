import { type NESAddrModesComponent } from '../addressing-modes/types'
import { type NESAluComponent } from '../alu/types'
import { type NESCpuComponent } from '../cpu/types'
import { type NESInstructionComponent } from '../instructions/types'
import { type NESMemoryComponent } from '../memory/types'

export interface NESComponents {
  cpu: NESCpuComponent
  alu: NESAluComponent
  instruction: NESInstructionComponent
  memory: NESMemoryComponent
}

export interface NESControlBus {
  cpu: NESCpuComponent
  alu: NESAluComponent
  instruction: NESInstructionComponent
  addressingModes: NESAddrModesComponent
  memory: NESMemoryComponent
  getComponents: () => NESComponents
}
