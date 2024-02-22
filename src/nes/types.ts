import { type NESControlBus } from './components/core/control-bus/types'
import { type NESDebuggerComponent } from './components/debugger/types'
import { type NESRomComponent } from './components/rom/types'

export interface NESComponents {
  control: NESControlBus
  nesDebugger: NESDebuggerComponent | undefined
}

export interface NESModule {
  debug: () => NESDebuggerComponent
  getComponents: () => NESComponents
  loadROM: (rom: NESRomComponent) => void
  powerUp: () => void
}
