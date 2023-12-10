import { AddressingModes } from './addressing-modes'
import { Instructions } from './instructions'

import { AddressingModeSize, CPU_ADDRESSING_MODES } from './consts/addressing-modes'
import { CPU_REGISTERS } from './consts/registers'
import { CPU_MEMORY_MAP } from './consts/memory-map'
import { ALU } from './alu'
import { CPU_FLAGS } from './consts/flags'
import { MEMORY_MIRRORS } from './consts/memory-mirros'
import { ROM } from '../rom/rom'
import { FileLoader } from '../../shared/utils/file-loader'

export class CPU {
  #rom = null
  #nesDebugger = null
  #cpuALU = null
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

  getMemorySection (start, end) {
    const sectionSize = end - start + 1
    const endOfMirrors = MEMORY_MIRRORS.PPUIORegisters.end
    const memorySection = new Uint8Array(sectionSize)

    for (let idxMemory = start, idxSection = 0; idxMemory <= end; idxMemory++, idxSection++) {
      if (idxMemory < endOfMirrors) {
        memorySection[idxSection] = this.load(idxMemory)
      } else {
        memorySection.set(this.MEM.subarray(idxMemory, end + 1), idxSection)
        break
      }
    }
    return memorySection
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

  loadAddressByAddressingMode (addressingMode, operand) {
    if (addressingMode === CPU_ADDRESSING_MODES.Absolute) {
      return operand
    }

    if (operand & (0x00ff === 0xff)) {
      return this.load(operand) + (this.load(operand & 0xff00) << 8)
    }

    return this.loadByAddressingMode(addressingMode, operand)
  }

  loadByAddressingMode (addressingMode, operand) {
    return this.#addressingModes.get(addressingMode, operand)
  }

  load (memoryAddress) {
    const mirrors = this.#getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      return this.#loadMirror(memoryAddress, mirrors)
    }

    return this.#loadByte(memoryAddress)
  }

  loadWord (memoryAddress) {
    return this.load(memoryAddress) + (this.load(memoryAddress + 1) << 8)
  }

  store (memoryAddress, memoryValue) {
    const mirrors = this.#getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      this.#storeMirror(memoryAddress, memoryValue, mirrors)
      return
    }

    this.#storeByte(memoryAddress, memoryValue)
  }

  storeWord (memoryAddress, memoryValue) {
    this.store(memoryAddress, memoryValue)
    this.store(memoryAddress + 1, (memoryValue & 0xff00) >> 8)
  }

  storeByAddressingMode (addressingMode, value, operand) {
    this.#addressingModes.set(addressingMode, value, operand)
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

    this.store(CPU_MEMORY_MAP.SND_CHN, 0x00)
    this.store(CPU_MEMORY_MAP.JOY2, 0x00)

    this.#loadResetVector()
    this.#run()
  }

  reset () {
    const previousSP = this.getRegister(CPU_REGISTERS.SP)
    this.setRegister(CPU_REGISTERS.SP, previousSP - 0x03)

    this.store(CPU_MEMORY_MAP.SND_CHN, 0x00)
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
    const opcode = this.load(pc)
    const instruction = [opcode]
    const instructionSize = this.#instructions.getInstructionSize(opcode)

    if (instructionSize === 0x02) {
      instruction.push(this.load(pc + 1))
    } else if (instructionSize === 0x03) {
      instruction.push(this.loadWord(pc + 1))
    }

    return instruction
  }

  #loadPRG () {
    const { buffer } = this.#rom.getPRG()
    buffer.copy(this.MEM, CPU_MEMORY_MAP.PRG_ROM)
  }

  #getMemoryMirrors (memoryAddress) {
    for (const mirror of Object.values(MEMORY_MIRRORS)) {
      if (memoryAddress >= mirror.start && memoryAddress < mirror.end) {
        return {
          ...mirror
        }
      }
    }

    return { start: 0, end: 0, mirrorSize: 0 }
  }

  #storeMirror (memoryAddress, value, mirrors) {
    const { start, mirrorSize } = mirrors
    const relativeAddress = memoryAddress % mirrorSize
    const mirroredAddress = start + relativeAddress

    this.#storeByte(mirroredAddress, value)
  }

  #storeByte (memoryAddress, memoryValue) {
    memoryAddress &= 0xffff
    this.MEM[memoryAddress] = memoryValue & 0xff
  }

  #loadMirror (memoryAddress, mirrors) {
    const { start, mirrorSize } = mirrors
    const relativeAddress = memoryAddress % mirrorSize
    const mirroredAddress = start + relativeAddress

    return this.#loadByte(mirroredAddress)
  }

  #loadByte (memoryAddress) {
    return this.MEM[memoryAddress & 0xffff]
  }

  #loadResetVector () {
    const resetVector = this.loadWord(CPU_MEMORY_MAP.Reset_Vector)
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
    this.#instructions = new Instructions(this, this.#cpuALU)
    this.#addressingModes = new AddressingModes(this, this.#cpuALU)

    this.cpuController = {
      paused: false,
      debugMode: false,
      insExecuted: 0,
      lastWrite: { address: -1, value: -1 }
    }
    this.MEM = new Uint8Array(CPU_MEMORY_MAP.Size)
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
