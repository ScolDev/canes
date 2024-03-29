import { BaseCPUExecutor } from 'src/nes/executors/base-cpu-executor'
import { type NESControlBus } from '../control-bus/types'
import { CPUMemoryMap } from '../memory/consts/memory-map'
import { CPUFlags } from './consts/flags'
import { CPUInstructionSize } from '../instructions/consts/instruction-size'
import { CPURegisters } from './consts/registers'
import { CPUInitialState } from './consts/state'
import {
  type NESCpuComponent,
  type CPUState,
  type CPURegister,
  type CPUExecutor
} from './types'
import { type CPUAddrMode } from '../addressing-modes/types'
import { type CPUInstruction } from '../instructions/types'

export class CPU implements NESCpuComponent {
  private readonly cpuState: CPUState = structuredClone(CPUInitialState)
  private cpuExecutor: CPUExecutor | null = BaseCPUExecutor.create()

  private readonly REG = {
    PC: 0x0000,
    SP: 0x1ff,
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    P: 0x00
  }

  private constructor (private readonly control: NESControlBus) {}

  execute (instruction: CPUInstruction): void {
    this.control.instruction.execute(instruction)
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

  isDebugged (): boolean {
    return this.cpuState.debugMode
  }

  setRegister (register: CPURegister, value: number): void {
    if (register === CPURegisters.PC) {
      this.REG.PC = value & 0xffff
    } else {
      this.REG[register] = value & 0xff
    }
  }

  powerUp (): void {
    this.setRegister(CPURegisters.P, 0x34)
    this.setRegister(CPURegisters.A, 0x00)
    this.setRegister(CPURegisters.X, 0x00)
    this.setRegister(CPURegisters.Y, 0x00)
    this.setRegister(CPURegisters.SP, 0xfd)

    this.control.memory.store(CPUMemoryMap.SND_CHN, 0x00)
    this.control.memory.store(CPUMemoryMap.JOY2, 0x00)
    this.loadResetVector()

    if (this.cpuExecutor !== null) {
      this.cpuState.isRunning = true
      this.cpuExecutor.execute()
    }
  }

  reset (): void {
    const previousSP = this.getRegister(CPURegisters.SP)
    this.setRegister(CPURegisters.SP, previousSP - 0x03)

    this.control.memory.store(CPUMemoryMap.SND_CHN, 0x00)
    this.control.alu.setFlag(CPUFlags.InterruptDisable)

    this.loadResetVector()

    if (this.cpuExecutor !== null) {
      this.cpuExecutor.execute()
    }
  }

  setDebugMode (status: boolean): void {
    this.cpuState.debugMode = status
  }

  setExecutor (executor: CPUExecutor): void {
    this.cpuExecutor = executor
  }

  private loadResetVector (): void {
    const resetVector = this.control.memory.loadWord(CPUMemoryMap.Reset_Vector)
    this.setRegister(CPURegisters.PC, resetVector)
  }

  private updateCtrl (): void {
    this.cpuState.insExecuted++
  }

  static create (control: NESControlBus): NESCpuComponent {
    return new CPU(control)
  }
}
