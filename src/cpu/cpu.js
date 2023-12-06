import { AddressingModes } from './addressing-modes'
import { Instructions } from './instructions'

import { AddressingModeSize, CPU_ADDRESSING_MODES } from './consts/addressing-modes'
import { CPU_REGISTERS } from './consts/registers'
import { CPU_MEMORY_MAP } from './consts/memory-map'
import { ALU } from './alu'
import { CPU_FLAGS } from './consts/flags'
import { MEMORY_MIRRORS } from './consts/memory-mirros'
import { Debugger } from '../debugger/debugger'
import { FileLoader } from '../utils/file-loader'
import { ROM } from '../rom/rom'

export const CPU = () => {
  const cpuController = {
    paused: false,
    debugMode: false,
    instructionsExecuted: 0,
    lastWrite: { address: -1, value: -1 }
  }
  const MEM = new Uint8Array(CPU_MEMORY_MAP.Size)
  const REG = {
    PC: 0x0000,
    SP: 0x1ff,
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    P: 0x00
  }

  const debug = () => {
    _setDebugMode(true)
    return nesDebugger
  }

  const execute = (instruction) => {
    instructions.execute(instruction)
    _updateCtrl()
  }

  const nextPC = (addressingMode, displacement = 0x00) => {
    const numOfBytes = AddressingModeSize.get(addressingMode) || 0x00
    const currentPC = getRegister(CPU_REGISTERS.PC)
    const nextPC = currentPC + numOfBytes + displacement

    setPC(nextPC)
  }

  const setPC = (address) => {
    setRegister(CPU_REGISTERS.PC, address)
  }

  const getPC = () => {
    return getRegister(CPU_REGISTERS.PC)
  }

  const getCPUController = () => {
    return cpuController
  }

  const getLastExecuted = () => {
    return instructions.getLastExecuted()
  }

  const getMemorySection = (start, end) => {
    const sectionSize = end - start + 1
    const endOfMirrors = MEMORY_MIRRORS.PPUIORegisters.end
    const memorySection = new Uint8Array(sectionSize)

    for (let idxMemory = start, idxSection = 0; idxMemory <= end; idxMemory++, idxSection++) {
      if (idxMemory < endOfMirrors) {
        memorySection[idxSection] = load(idxMemory)
      } else {
        memorySection.set(MEM.subarray(idxMemory, end + 1), idxSection)
        break
      }
    }
    return memorySection
  }

  const getRegister = (register) => {
    if (register === CPU_REGISTERS.PC) {
      return REG.PC & 0xffff
    }

    return REG[register] & 0xff
  }

  const setRegister = (register, value) => {
    if (register === CPU_REGISTERS.PC) {
      REG.PC = value & 0xffff
    } else {
      REG[register] = value & 0xff
    }
  }

  const loadAddressByAddressingMode = (addressingMode, operand) => {
    if (addressingMode === CPU_ADDRESSING_MODES.Absolute) {
      return operand
    }

    if (operand & (0x00ff === 0xff)) {
      return load(operand) + (load(operand & 0xff00) << 8)
    }

    return loadByAddressingMode(addressingMode, operand)
  }

  const loadByAddressingMode = (addressingMode, operand) => {
    return addressingModes.get(addressingMode, operand)
  }

  const load = (memoryAddress) => {
    const mirrors = _getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      return _loadMirror(memoryAddress, mirrors)
    }

    return _loadByte(memoryAddress)
  }

  const loadWord = (memoryAddress) => {
    return load(memoryAddress) + (load(memoryAddress + 1) << 8)
  }

  const store = (memoryAddress, memoryValue) => {
    const mirrors = _getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      _storeMirror(memoryAddress, memoryValue, mirrors)
      return
    }

    _storeByte(memoryAddress, memoryValue)
  }

  const storeWord = (memoryAddress, memoryValue) => {
    store(memoryAddress, memoryValue)
    store(memoryAddress + 1, (memoryValue & 0xff00) >> 8)
  }

  const storeByAddressingMode = (addressingMode, value, operand) => {
    addressingModes.set(addressingMode, value, operand)
  }

  const loadROM = async ({ filePath }) => {
    const fileLoader = FileLoader(filePath)
    rom = await ROM(fileLoader)

    if (rom.getHeader().isValid) {
      _loadPRG()
      powerUp()
    }
  }

  const powerUp = () => {
    setRegister(CPU_REGISTERS.P, 0x34)
    setRegister(CPU_REGISTERS.A, 0x00)
    setRegister(CPU_REGISTERS.X, 0x00)
    setRegister(CPU_REGISTERS.Y, 0x00)
    setRegister(CPU_REGISTERS.SP, 0xfd)

    store(CPU_MEMORY_MAP.SND_CHN, 0x00)
    store(CPU_MEMORY_MAP.JOY2, 0x00)

    _loadResetVector()
    _run()
  }

  const reset = () => {
    const previousSP = getRegister(CPU_REGISTERS.SP)
    setRegister(CPU_REGISTERS.SP, previousSP - 0x03)

    store(CPU_MEMORY_MAP.SND_CHN, 0x00)
    cpuALU.setFlag(CPU_FLAGS.InterruptDisable)

    _loadResetVector()
    _run()
  }

  const _run = () => {
    setTimeout(_runPRG, 0)
  }

  const _runPRG = () => {
    for (let tick = 0; tick < 256; tick++) {
      if (cpuController.debugMode) {
        nesDebugger.validate()
      }
      if (cpuController.paused) {
        return
      }
      _executeCurrent()
    }
    _run()
  }

  const _executeCurrent = () => {
    const instruction = _fetchInstruction()
    execute(instruction)
  }

  const _fetchInstruction = () => {
    const pc = getPC()
    const opcode = load(pc)
    const instruction = [opcode]
    const instructionSize = instructions.getInstructionSize(opcode)

    if (instructionSize === 0x02) {
      instruction.push(load(pc + 1))
    } else if (instructionSize === 0x03) {
      instruction.push(loadWord(pc + 1))
    }

    return instruction
  }

  const _loadPRG = () => {
    const { buffer } = rom.getPRG()
    buffer.copy(MEM, CPU_MEMORY_MAP.PRG_ROM)
  }

  const _getMemoryMirrors = (memoryAddress) => {
    for (const mirror of Object.values(MEMORY_MIRRORS)) {
      if (memoryAddress >= mirror.start && memoryAddress < mirror.end) {
        return {
          ...mirror
        }
      }
    }

    return { start: 0, end: 0, mirrorSize: 0 }
  }

  const _storeMirror = (memoryAddress, value, mirrors) => {
    const { start, mirrorSize } = mirrors
    const relativeAddress = memoryAddress % mirrorSize
    const mirroredAddress = start + relativeAddress

    _storeByte(mirroredAddress, value)
  }

  const _storeByte = (memoryAddress, memoryValue) => {
    memoryAddress &= 0xffff
    MEM[memoryAddress] = memoryValue & 0xff
  }

  const _loadMirror = (memoryAddress, mirrors) => {
    const { start, mirrorSize } = mirrors
    const relativeAddress = memoryAddress % mirrorSize
    const mirroredAddress = start + relativeAddress

    return _loadByte(mirroredAddress)
  }

  const _loadByte = (memoryAddress, memoryValue) => {
    return MEM[memoryAddress & 0xffff]
  }

  const _loadResetVector = () => {
    const resetVector = loadWord(CPU_MEMORY_MAP.Reset_Vector)
    setRegister(CPU_REGISTERS.PC, resetVector)
  }

  const _setDebugMode = (status) => {
    cpuController.debugMode = status
  }

  const _updateCtrl = () => {
    cpuController.instructionsExecuted++
  }

  const cpuApi = {
    debug,
    execute,
    getCPUController,
    getLastExecuted,
    getMemorySection,
    getRegister,
    setRegister,
    getPC,
    setPC,
    load,
    loadWord,
    loadByAddressingMode,
    loadAddressByAddressingMode,
    nextPC,
    loadROM,
    powerUp,
    reset,
    store,
    storeWord,
    storeByAddressingMode
  }

  let rom = null
  const cpuALU = ALU(cpuApi)
  const nesDebugger = Debugger(cpuApi)
  const instructions = Instructions(cpuApi, cpuALU)
  const addressingModes = AddressingModes(cpuApi, cpuALU)

  return cpuApi
}
