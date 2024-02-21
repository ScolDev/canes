import { type NESCpuComponent, type NESAluComponent, type NESInstructionComponent, type NESAddrModesComponent } from '../cpu/types'
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
