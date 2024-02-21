import { type NESControlBus } from './components/core/control-bus/types'
import { type NESDebuggerComponent } from './components/debugger/types'
import { type ROMSource } from './components/rom/types'

export interface NESComponents {
  control: NESControlBus
  nesDebugger: NESDebuggerComponent | undefined
}

export interface NESModule {
  debug: () => NESDebuggerComponent
  getComponents: () => NESComponents
  loadROM: (romSource: ROMSource) => Promise<void>
  powerUp: () => void
}
