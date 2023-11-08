import { AddressingModes } from './addressing-modes'
import { Instructions } from './instructions'

import { CPU_ADDRESSING_MODES } from './consts/addressing-modes'
import { CPU_REGISTERS } from './consts/registers'
import { CPU_MEMORY_MAP } from './consts/memory-map'
import { ALU } from './alu'
import { CPU_FLAGS } from './consts/flags'
import { MEMORY_MIRRORS } from './consts/memory-mirros'

export const CPU = () => {
  const MEM = new Uint8Array(CPU_MEMORY_MAP.Size)
  const REG = {
    PC: 0x0000,
    SP: 0x1ff,
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    P: 0x00
  }

  const execute = (instruction) => {
    instructions.execute(instruction)
  }

  const getMemorySection = (start, end) => {
    return Buffer.from(MEM.subarray(start, end + 1))
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
    return MEM[memoryAddress & 0xffff]
  }

  const loadWord = (memoryAddress) => {
    return load(memoryAddress) + (load(memoryAddress + 1) << 8)
  }

  const store = (memoryAddress, memoryValue) => {
    _storeByte(memoryAddress, memoryValue)

    const mirrors = _getMemoryMirrors(memoryAddress)
    if (mirrors.mirrorSize > 0) {
      _mirror(memoryAddress, memoryValue, mirrors)
    }
  }

  const storeWord = (memoryAddress, memoryValue) => {
    store(memoryAddress, memoryValue)
    store(memoryAddress + 1, (memoryValue & 0xff00) >> 8)
  }

  const storeByAddressingMode = (addressingMode, value, operand) => {
    addressingModes.set(addressingMode, value, operand)
  }

  const powerUp = () => {
    setRegister(CPU_REGISTERS.P, 0x34)
    setRegister(CPU_REGISTERS.A, 0x00)
    setRegister(CPU_REGISTERS.X, 0x00)
    setRegister(CPU_REGISTERS.Y, 0x00)
    setRegister(CPU_REGISTERS.SP, 0xfd)

    store(CPU_MEMORY_MAP.SND_CHN, 0x00)
    store(CPU_MEMORY_MAP.JOY2, 0x00)
  }

  const reset = () => {
    const previousSP = getRegister(CPU_REGISTERS.SP)
    setRegister(CPU_REGISTERS.SP, previousSP - 0x03)

    store(CPU_MEMORY_MAP.SND_CHN, 0x00)
    cpuALU.setFlag(CPU_FLAGS.InterruptDisable)
  }

  const _getMemoryMirrors = (memoryAddress) => {
    for (const mirror of Object.values(MEMORY_MIRRORS)) {
      if (memoryAddress >= mirror.start && memoryAddress <= mirror.end) {
        return {
          ...mirror
        }
      }
    }

    return { start: 0, end: 0, mirrorSize: 0 }
  }

  const _mirror = (memoryAddress, value, mirrors) => {
    const { start, end, mirrorSize } = mirrors

    for (
      let baseAddress = start;
      baseAddress < end;
      baseAddress += mirrorSize
    ) {
      const relativeAddress = memoryAddress % mirrorSize
      const mirroredAddress = baseAddress + relativeAddress

      _storeByte(mirroredAddress, value)
    }
  }

  const _storeByte = (memoryAddress, memoryValue) => {
    memoryAddress &= 0xffff
    MEM[memoryAddress] = memoryValue & 0xff
  }

  const cpuApi = {
    execute,
    getMemorySection,
    getRegister,
    setRegister,
    load,
    loadWord,
    loadByAddressingMode,
    loadAddressByAddressingMode,
    powerUp,
    reset,
    store,
    storeWord,
    storeByAddressingMode
  }

  const cpuALU = ALU(cpuApi)
  const instructions = Instructions(cpuApi, cpuALU)
  const addressingModes = AddressingModes(cpuApi, cpuALU)

  return cpuApi
}
