import { Instructions } from './instructions'

import { AddressingModeSize } from './consts/addressing-modes'
import { CPU_REGISTERS } from './consts/registers'
import { CPU_MEMORY_MAP } from '../memory/consts/memory-map'
import { ALU } from './alu'
import { CPU_FLAGS } from './consts/flags'
import { ROM } from '../rom/rom'
import { FileLoader } from '../../shared/utils/file-loader'
import { Memory } from '../memory/memory'

export class CPU {
  #rom = null
  #cpuALU = null
  #nesDebugger = null
  #instructions = null
  #addressingModes = null

  constructor () {
    this.#initComponents()
  }

  debug (_debugger) {
    this.nesDebugger = _debugger
    this.#setDebugMode(true)
  }

  execute (instruction) {
    this.#instructions.execute(instruction)
    this.#updateCtrl()
  }

  nextPC (addressingMode, displacement = 0x00) {
    const numOfBytes = AddressingModeSize.get(addressingMode) || 0x00
    const currentPC = this.getRegister(CPU_REGISTERS.PC)
    const nextPC = currentPC + numOfBytes + displacement

    this.setPC(nextPC)
  }

  setPC (address) {
    this.setRegister(CPU_REGISTERS.PC, address)
  }

  getPC () {
    return this.getRegister(CPU_REGISTERS.PC)
  }

  getCPUController () {
    return this.cpuController
  }

  getLastExecuted () {
    return this.#instructions.getLastExecuted()
  }

  getRegister (register) {
    if (register === CPU_REGISTERS.PC) {
      return this.REG.PC & 0xffff
    }

    return this.REG[register] & 0xff
  }

  setRegister (register, value) {
    if (register === CPU_REGISTERS.PC) {
      this.REG.PC = value & 0xffff
    } else {
      this.REG[register] = value & 0xff
    }
  }

  async loadROM ({ filePath }) {
    const fileLoader = FileLoader(filePath)
    this.#rom = new ROM(fileLoader)
    await this.#rom.load()

    if (this.#rom.getHeader().isValid) {
      this.#loadPRG()
      this.powerUp()
    }
  }

  powerUp () {
    this.setRegister(CPU_REGISTERS.P, 0x34)
    this.setRegister(CPU_REGISTERS.A, 0x00)
    this.setRegister(CPU_REGISTERS.X, 0x00)
    this.setRegister(CPU_REGISTERS.Y, 0x00)
    this.setRegister(CPU_REGISTERS.SP, 0xfd)

    this.memory.store(CPU_MEMORY_MAP.SND_CHN, 0x00)
    this.memory.store(CPU_MEMORY_MAP.JOY2, 0x00)

    this.#loadResetVector()
    this.#run()
  }

  reset () {
    const previousSP = this.getRegister(CPU_REGISTERS.SP)
    this.setRegister(CPU_REGISTERS.SP, previousSP - 0x03)

    this.memory.store(CPU_MEMORY_MAP.SND_CHN, 0x00)
    this.#cpuALU.setFlag(CPU_FLAGS.InterruptDisable)

    this.#loadResetVector()
    this.#run()
  }

  #run () {
    setTimeout(() => {
      this.#runPRG()
    }, 0)
  }

  #runPRG () {
    for (let tick = 0; tick < 256; tick++) {
      if (this.cpuController.debugMode) {
        this.nesDebugger.validate()
      }
      if (this.cpuController.paused) {
        return
      }
      this.#executeCurrent()
    }
    this.#run()
  }

  #executeCurrent () {
    const instruction = this.#fetchInstruction()
    this.execute(instruction)
  }

  #fetchInstruction () {
    const pc = this.getPC()
    const opcode = this.memory.load(pc)
    const instruction = [opcode]
    const instructionSize = this.#instructions.getInstructionSize(opcode)

    if (instructionSize === 0x02) {
      instruction.push(this.memory.load(pc + 1))
    } else if (instructionSize === 0x03) {
      instruction.push(this.memory.loadWord(pc + 1))
    }

    return instruction
  }

  #loadPRG () {
    const { buffer } = this.#rom.getPRG()
    this.memory.copy(buffer, CPU_MEMORY_MAP.PRG_ROM)
  }

  #loadResetVector () {
    const resetVector = this.memory.loadWord(CPU_MEMORY_MAP.Reset_Vector)
    this.setRegister(CPU_REGISTERS.PC, resetVector)
  }

  #setDebugMode (status) {
    this.cpuController.debugMode = status
  }

  #updateCtrl () {
    this.cpuController.insExecuted++
  }

  #initComponents () {
    this.#cpuALU = new ALU(this)
    this.memory = new Memory(this, this.#cpuALU)
    this.#instructions = new Instructions(this, this.#cpuALU)

    this.cpuController = {
      paused: false,
      debugMode: false,
      insExecuted: 0,
      lastWrite: { address: -1, value: -1 }
    }
    this.REG = {
      PC: 0x0000,
      SP: 0x1ff,
      A: 0x00,
      X: 0x00,
      Y: 0x00,
      P: 0x00
    }
  }
}
