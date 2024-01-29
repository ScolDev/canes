import ControlBus from '../core/control-bus/control-bus'
import { type NESControlBus } from '../core/control-bus/types'
import { CPU } from '../core/cpu/cpu'
import { DebugCPUExecutor } from './executors/debug-cpu-executor'
import {
  type NESCpuComponent,
  type NESAluComponent,
  type NESInstructionComponent
} from '../core/cpu/types'
import { CPUMemoryMap } from '../core/memory/consts/memory-map'
import { type NESMemoryComponent } from '../core/memory/types'
import { FileLoader } from '../shared/utils/file-loader'
import { Debugger } from './components/debugger/debugger'
import { type NESDebuggerComponent } from './components/debugger/types'
import { ROM } from './components/rom/rom'
import { type NESRomComponent, type ROMSource } from './components/rom/types'
import { type NESModule, type NESComponents } from './types'

export class NES implements NESModule {
  private readonly control: NESControlBus
  private nesDebugger: NESDebuggerComponent | undefined

  private readonly cpu: NESCpuComponent
  private readonly alu: NESAluComponent
  private readonly instruction: NESInstructionComponent
  private readonly memory: NESMemoryComponent

  private rom: NESRomComponent | undefined

  private constructor () {
    this.control = ControlBus.create()

    const { cpu, alu, instruction, memory } = this.control.getComponents()
    this.cpu = cpu
    this.alu = alu
    this.instruction = instruction
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
      cpu: this.cpu,
      cpuALU: this.alu,
      instruction: this.instruction,
      memory: this.memory,
      nesDebugger: this.nesDebugger
    }
  }

  async loadROM ({ filePath }: ROMSource): Promise<void> {
    const fileLoader = FileLoader(filePath)
    this.rom = new ROM(fileLoader)
    await this.rom.load()
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
    this.memory.copy(buffer, CPUMemoryMap.PRG_ROM)
  }

  static create (): NESModule {
    return new NES()
  }
}
