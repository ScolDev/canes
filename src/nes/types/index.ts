import { type NESCpuComponent, type NESAluComponent, type NESInstructionComponent } from '../../core/cpu/types'
import { type NESMemoryComponent } from '../../core/memory/types'
import { type ROMSource } from '../components/rom/types'

export interface NESComponents {
  cpu: NESCpuComponent
  cpuALU: NESAluComponent
  memory: NESMemoryComponent
}

export interface NESModule {
  getComponents: () => NESComponents
  loadROM: (romSource: ROMSource) => Promise<void>
  powerUp: () => void
}
