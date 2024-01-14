import { CPU } from '../core/cpu/cpu'
import { DebugCPUExecutor } from '../core/cpu/executors/debug-cpu-executor'
import { type NESCpuComponent, type NESAluComponent } from '../core/cpu/types'
import { CPUMemoryMap } from '../core/memory/consts/memory-map'
import { type NESMemoryComponent } from '../core/memory/types'
import { FileLoader } from '../shared/utils/file-loader'
import { Debugger } from './components/debugger/debugger'
import { type NESDebuggerComponent } from './components/debugger/types'
import { ROM } from './components/rom/rom'
import { type NESRomComponent, type ROMSource } from './components/rom/types'
import { type NESModule, type NESComponents } from './types'

export class NES implements NESModule {
  private readonly cpu: NESCpuComponent
  private readonly alu: NESAluComponent
  private readonly memory: NESMemoryComponent
  private rom: NESRomComponent
  private readonly nesDebugger: NESDebuggerComponent

  private constructor () {
    this.cpu = CPU.create()
    this.nesDebugger = Debugger.create()

    const { cpuALU, memory } = this.cpu.getComponents()
    this.alu = cpuALU
    this.memory = memory
  }

  debug (): NESDebuggerComponent {
    const executor = DebugCPUExecutor.create(this)

    this.cpu.setExecutor(executor)
    this.cpu.setDebugMode(true)
    this.nesDebugger.attach(this.cpu)

    return this.nesDebugger
  }

  getComponents (): NESComponents {
    return {
      cpu: this.cpu,
      cpuALU: this.alu,
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
    if (this.rom.getHeader() !== null) {
      this.loadPRG()
      this.cpu.powerUp()
    }
  }

  private loadPRG (): void {
    const { buffer } = this.rom.getPRG()
    this.memory.copy(buffer, CPUMemoryMap.PRG_ROM)
  }

  static create (): NESModule {
    return new NES()
  }
}
