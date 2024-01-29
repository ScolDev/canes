import { CPUMemoryMap } from '../memory/consts/memory-map'
import { CPUFlags } from './consts/flags'
import { CPUInstructionSize } from './consts/instructions'
import { CPURegisters } from './consts/registers'
import { CPUInitialState } from './consts/state'
import { type NESControlBus } from '../control-bus/types/index'
import {
  type NESCpuComponent,
  type CPUState,
  type CPUInstruction,
  type CPUAddrMode,
  type CPURegister,
  type CPUExecutor
} from './types'
import { NESBusRequests } from '../control-bus/consts/bus-events'

export class CPU implements NESCpuComponent {
  private readonly cpuState: CPUState = structuredClone(CPUInitialState)
  private cpuExecutor: CPUExecutor | null = null

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
    this.control.notify({
      type: NESBusRequests.Execute,
      data: instruction
    })

    this.updateCtrl()
  }

  fetchInstructionBytes (): CPUInstruction {
    const pc = this.getPC()
    const opcode = this.control.request<number>({
      type: NESBusRequests.Load,
      data: pc
    })

    const instruction: CPUInstruction = [opcode]
    const instructionSize = this.control.request<number>({
      type: NESBusRequests.GetInstructionSize,
      data: opcode
    })

    if (instructionSize === 0x02) {
      instruction[1] = this.control.request({
        type: NESBusRequests.Load,
        data: pc + 1
      })
    } else if (instructionSize === 0x03) {
      instruction[1] = this.control.request({
        type: NESBusRequests.LoadWord,
        data: pc + 1
      })
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
    this.loadResetVector()

    this.control.notify({
      type: NESBusRequests.Store,
      data: {
        address: CPUMemoryMap.SND_CHN,
        value: 0x00
      }
    })

    this.control.notify({
      type: NESBusRequests.Store,
      data: {
        address: CPUMemoryMap.JOY2,
        value: 0x00
      }
    })

    if (this.cpuExecutor !== null) {
      this.cpuExecutor.execute()
    }
  }

  reset (): void {
    const previousSP = this.getRegister(CPURegisters.SP)
    this.setRegister(CPURegisters.SP, previousSP - 0x03)

    this.control.notify({
      type: NESBusRequests.Store,
      data: {
        address: CPUMemoryMap.SND_CHN,
        value: 0x00
      }
    })

    this.control.notify({
      type: NESBusRequests.SetFlag,
      data: {
        flag: CPUFlags.InterruptDisable
      }
    })

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
    const resetVector = this.control.request<number>({
      type: NESBusRequests.LoadWord,
      data: CPUMemoryMap.Reset_Vector
    })

    this.setRegister(CPURegisters.PC, resetVector)
  }

  private updateCtrl (): void {
    this.cpuState.insExecuted++
  }

  static create (control: NESControlBus): NESCpuComponent {
    return new CPU(control)
  }
}
