import { type Debugger } from '../../nes/components/debugger/debugger'
import { type NESDebugger } from '../../nes/components/debugger/types'
import { ROM } from '../../nes/components/rom/rom'
import { type NESRom, type ROMSource } from '../../nes/components/rom/types'
import { FileLoader } from '../../shared/utils/file-loader'
import { CPUMemoryMap } from '../memory/consts/memory-map'
import { Memory } from '../memory/memory'
import { type NESMemory } from '../memory/types'
import { ALU } from './components/alu'
import { Instruction } from './components/instructions/instruction'
import { CPUFlags } from './consts/flags'
import { CPUInstructionSize } from './consts/instructions'
import { CPURegisters } from './consts/registers'
import { InitialCPUState } from './consts/state'
import {
  type NESCpuModule,
  type NESAlu,
  type NESInstruction,
  type CPUState,
  type NESComponents,
  type CPUInstruction,
  type CPUAddrMode,
  type CPURegister
} from './types'

export class CPU implements NESCpuModule {
  private cpuALU: NESAlu
  private rom: NESRom
  private memory: NESMemory
  private nesDebugger: NESDebugger
  private instruction: NESInstruction
  private cpuState: CPUState = InitialCPUState

  private readonly REG = {
    PC: 0x0000,
    SP: 0x1ff,
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    P: 0x00
  }

  private constructor () {}

  initComponents (): void {
    this.cpuState = { ...InitialCPUState }

    this.cpuALU = ALU.create(this)
    this.memory = Memory.create(this)
    this.memory.initComponents()
    this.instruction = Instruction.create(this)
  }

  getComponents (): NESComponents {
    return {
      cpuALU: this.cpuALU,
      memory: this.memory
    }
  }

  debug (_debugger: Debugger): void {
    this.nesDebugger = _debugger
    this.setDebugMode(true)
  }

  execute (instruction: CPUInstruction): void {
    this.instruction.execute(instruction)
    this.updateCtrl()
  }

  nextPC (addressingMode: CPUAddrMode, displacement = 0x00): void {
    const instructionSize = CPUInstructionSize[addressingMode]
    const currentPC = this.getRegister(CPURegisters.PC)
    const nextPC: number = currentPC + instructionSize + displacement

    this.setPC(nextPC)
  }

  setPC (address: number): void {
    this.setRegister(CPURegisters.PC, address)
  }

  getPC (): number {
    return this.getRegister(CPURegisters.PC)
  }

  getCPUState (): CPUState {
    return this.cpuState
  }

  getRegister (register: CPURegister): number {
    if (register === CPURegisters.PC) {
      return this.REG.PC & 0xffff
    }

    return this.REG[register] & 0xff
  }

  setRegister (register: CPURegister, value: number): void {
    if (register === CPURegisters.PC) {
      this.REG.PC = value & 0xffff
    } else {
      this.REG[register] = value & 0xff
    }
  }

  async loadROM ({ filePath }: ROMSource): Promise<void> {
    const fileLoader = FileLoader(filePath)
    this.rom = new ROM(fileLoader)
    await this.rom.load()

    if (this.rom.getHeader() !== null) {
      this.loadPRG()
      this.powerUp()
    }
  }

  powerUp (): void {
    this.setRegister(CPURegisters.P, 0x34)
    this.setRegister(CPURegisters.A, 0x00)
    this.setRegister(CPURegisters.X, 0x00)
    this.setRegister(CPURegisters.Y, 0x00)
    this.setRegister(CPURegisters.SP, 0xfd)

    this.memory.store(CPUMemoryMap.SND_CHN, 0x00)
    this.memory.store(CPUMemoryMap.JOY2, 0x00)

    this.loadResetVector()
    this.run()
  }

  reset (): void {
    const previousSP = this.getRegister(CPURegisters.SP)
    this.setRegister(CPURegisters.SP, previousSP - 0x03)

    this.memory.store(CPUMemoryMap.SND_CHN, 0x00)
    this.cpuALU.setFlag(CPUFlags.InterruptDisable)

    this.loadResetVector()
    this.run()
  }

  private run (): void {
    setTimeout(() => {
      this.runPRG()
    }, 0)
  }

  private runPRG (): void {
    for (let tick = 0; tick < 256; tick++) {
      if (this.cpuState.debugMode) {
        this.nesDebugger.validate()
      }

      if (!this.cpuState.paused) {
        this.executeCurrent()
      } else {
        this.setLastExecuted()
        break
      }
    }
    this.run()
  }

  private executeCurrent (): void {
    const instruction = this.fetchInstruction()
    this.execute(instruction)
  }

  private fetchInstruction (): CPUInstruction {
    const pc = this.getPC()
    const opcode = this.memory.load(pc)
    const instruction: CPUInstruction = [opcode]
    const instructionSize = this.instruction.getInstructionSize(opcode)

    if (instructionSize === 0x02) {
      instruction[1] = this.memory.load(pc + 1)
    } else if (instructionSize === 0x03) {
      instruction[1] = this.memory.loadWord(pc + 1)
    }

    return instruction
  }

  private loadPRG (): void {
    const { buffer } = this.rom.getPRG()
    this.memory.copy(buffer, CPUMemoryMap.PRG_ROM)
  }

  private loadResetVector (): void {
    const resetVector = this.memory.loadWord(CPUMemoryMap.Reset_Vector)
    this.setRegister(CPURegisters.PC, resetVector)
  }

  private setDebugMode (status: boolean): void {
    this.cpuState.debugMode = status
  }

  private setLastExecuted (): void {
    const lastExecuted = this.instruction.getLastExecuted()
    if (lastExecuted === undefined) return

    this.cpuState.lastExecuted = {
      opcode: lastExecuted.bytes[0],
      asm: lastExecuted.module.getASM(lastExecuted.bytes)
    }
  }

  private updateCtrl (): void {
    this.cpuState.insExecuted++
  }

  static create (): NESCpuModule {
    const cpu = new CPU()
    cpu.initComponents()

    return cpu
  }
}
