import { type NESControlBus } from './components/core/control-bus/types'
import { type CPUState } from './components/core/cpu/types'
import { type DebugState, type NESDebuggerComponent } from './components/debugger/types'
import { type NESRomComponent } from './components/rom/types'

export interface NESComponents {
  control: NESControlBus
  nesDebugger: NESDebuggerComponent | undefined
  rom: NESRomComponent | undefined
}

export interface NESState {
  cpu: CPUState
  debugger?: DebugState
}

export interface NESModule {
  debug: () => NESDebuggerComponent
  getComponents: () => NESComponents
  isPowerOn: () => boolean
  loadROM: (rom: NESRomComponent) => void
  powerUp: () => void
}
