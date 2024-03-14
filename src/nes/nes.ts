import { DebugCPUExecutor } from './executors/debug-cpu-executor'
import { Debugger } from './debugger/debugger'
import { type NESDebuggerComponent } from './debugger/types'
import { type NESModule, type NESComponents } from './types'
import { type NESCpuComponent } from './core/cpu/types'
import { CPUMemoryMap } from './core/memory/consts/memory-map'
import { type NESMemoryComponent } from './core/memory/types'
import { type NESControlBus } from './core/control-bus/types'
import ControlBus from './core/control-bus/control-bus'
import { type NESRomComponent } from './rom/types'

export class NES implements NESModule {
  private readonly control: NESControlBus
  private nesDebugger: NESDebuggerComponent | undefined

  private readonly cpu: NESCpuComponent
  private readonly memory: NESMemoryComponent

  private rom: NESRomComponent | undefined

  private constructor () {
    this.control = ControlBus.create()

    const { cpu, memory } = this.control.getComponents()
    this.cpu = cpu
    this.memory = memory
  }

  debug (): NESDebuggerComponent {
    this.nesDebugger = Debugger.create(this.control)
    const executor = DebugCPUExecutor.create(this)

    this.cpu.setExecutor(executor)
    this.cpu.setDebugMode(true)

    return this.nesDebugger
  }

  getComponents (): NESComponents {
    return {
      control: this.control,
      nesDebugger: this.nesDebugger,
      rom: this.rom
    }
  }

  isPowerOn (): boolean {
    return this.cpu.getCPUState().isRunning
  }

  loadROM (rom: NESRomComponent): void {
    this.rom = rom
    this.powerUp()
  }

  powerUp (): void {
    if (this.rom === undefined) {
      throw Error('ROM has not been loaded.')
    }

    if (this.rom.getHeader() !== null) {
      this.loadPRG()
      this.cpu.powerUp()
    }
  }

  private loadPRG (): void {
    if (this.rom === undefined) return

    const { buffer } = this.rom.getPRG()
    this.memory.copy(buffer, CPUMemoryMap.PRG_ROM_START)
  }

  static create (): NESModule {
    return new NES()
  }
}
