import {
  type NESCpuComponent,
  type NESAluComponent,
  type NESInstructionComponent
} from '../../core/cpu/types'
import { type NESMemoryComponent } from '../../core/memory/types'
import { type NESDebuggerComponent } from '../components/debugger/types'
import { type ROMSource } from '../components/rom/types'

export interface NESComponents {
  cpu: NESCpuComponent
  cpuALU: NESAluComponent
  instruction: NESInstructionComponent
  memory: NESMemoryComponent
  nesDebugger: NESDebuggerComponent | undefined
}

export interface NESModule {
  debug: () => NESDebuggerComponent
  getComponents: () => NESComponents
  loadROM: (romSource: ROMSource) => Promise<void>
  powerUp: () => void
}
