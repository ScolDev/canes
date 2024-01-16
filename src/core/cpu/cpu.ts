import { CPUMemoryMap } from '../memory/consts/memory-map'
import { Memory } from '../memory/memory'
import { type NESMemoryComponent } from '../memory/types'
import { ALU } from './components/alu'
import { Instruction } from './components/instructions/instruction'
import { CPUFlags } from './consts/flags'
import { CPUInstructionSize } from './consts/instructions'
import { CPURegisters } from './consts/registers'
import { CPUInitialState } from './consts/state'
import {
  type NESCpuComponent,
  type CPUState,
  type CPUInstruction,
  type CPUAddrMode,
  type CPURegister,
  type NESCpuComponents,
  type CPUExecutor,
  type NESAluComponent,
  type NESInstructionComponent
} from './types'

export class CPU implements NESCpuComponent {
  private cpuState: CPUState = { ...CPUInitialState }
  private cpuExecutor: CPUExecutor | null = null

  private cpuALU: NESAluComponent | null
  private memory: NESMemoryComponent | null
  private instruction: NESInstructionComponent | null

  private readonly REG = {
    PC: 0x0000,
    SP: 0x1ff,
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    P: 0x00
  }

  private constructor () {}

  getComponents (): NESCpuComponents {
    return {
      cpuALU: this.cpuALU,
      memory: this.memory,
      instruction: this.instruction
    }
  }

  execute (instruction: CPUInstruction): void {
    this.instruction.execute(instruction)
    this.updateCtrl()
  }

  fetchInstructionBytes (): CPUInstruction {
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

  powerUp (): void {
    this.setRegister(CPURegisters.P, 0x34)
    this.setRegister(CPURegisters.A, 0x00)
    this.setRegister(CPURegisters.X, 0x00)
    this.setRegister(CPURegisters.Y, 0x00)
    this.setRegister(CPURegisters.SP, 0xfd)

    this.memory.store(CPUMemoryMap.SND_CHN, 0x00)
    this.memory.store(CPUMemoryMap.JOY2, 0x00)
    this.loadResetVector()

    if (this.cpuExecutor !== null) {
      this.cpuExecutor.execute()
    }
  }

  reset (): void {
    const previousSP = this.getRegister(CPURegisters.SP)
    this.setRegister(CPURegisters.SP, previousSP - 0x03)

    this.memory.store(CPUMemoryMap.SND_CHN, 0x00)
    this.cpuALU.setFlag(CPUFlags.InterruptDisable)

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

  private initComponents (): void {
    this.cpuState = { ...CPUInitialState }

    this.cpuALU = ALU.create(this)
    this.memory = Memory.create(this)
    this.memory.initComponents()
    this.instruction = Instruction.create(this)
  }

  private loadResetVector (): void {
    const resetVector = this.memory.loadWord(CPUMemoryMap.Reset_Vector)
    this.setRegister(CPURegisters.PC, resetVector)
  }

  private updateCtrl (): void {
    this.cpuState.insExecuted++
  }

  static create (): NESCpuComponent {
    const cpu = new CPU()
    cpu.initComponents()

    return cpu
  }
}
