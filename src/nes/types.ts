import { type NESControlBus } from './core/control-bus/types'
import { type CPUState } from './core/cpu/types'
import { type DebugState, type NESDebuggerComponent } from './debugger/types'
import { type NESRomComponent } from './rom/types'

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
