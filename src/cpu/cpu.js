import { AddressingModes } from './addressing-modes'
import { Instructions } from './instructions'

import { CPU_ADDRESSING_MODES } from './consts/addressing-modes'
import { CPU_REGISTERS } from './consts/registers'
import { CPU_MEMORY_MAP } from './consts/memory-map'
import { ALU } from './alu'

export default () => {
  const MEM = new Uint8Array(CPU_MEMORY_MAP.Size)
  const REG = {
    PC: 0x0000,
    SP: 0x1ff,
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    P: 0x00
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

    if (operand & 0x00ff === 0xff) {
      return load(operand) + (load(operand & 0xff00) << 8)
    }

    return loadByAddressingMode(addressingMode, operand)
  }

  const loadByAddressingMode = (addressingMode, operand) => {
    return addressingModes.get(addressingMode, operand)
  }

  const storeByAddressingMode = (addressingMode, value, operand) => {
    addressingModes.set(addressingMode, value, operand)
  }

  const load = (memoryAddress) => {
    return MEM[memoryAddress & 0xffff]
  }

  const loadWord = (memoryAddress) => {
    return load(memoryAddress) + (load(memoryAddress + 1) << 8)
  }

  const store = (memoryAddress, memoryValue) => {
    memoryAddress &= 0xffff
    MEM[memoryAddress] = memoryValue & 0xff
  }

  const storeWord = (memoryAddress, memoryValue) => {
    store(memoryAddress, memoryValue)
    store(memoryAddress + 1, (memoryValue & 0xff00) >> 8)
  }

  const execute = (instruction) => {
    instructions.execute(instruction)
  }

  const cpuApi = {
    execute,
    getRegister,
    setRegister,
    load,
    loadWord,
    loadByAddressingMode,
    loadAddressByAddressingMode,
    store,
    storeWord,
    storeByAddressingMode
  }

  const cpuALU = ALU(cpuApi)
  const instructions = Instructions(cpuApi, cpuALU)
  const addressingModes = AddressingModes(cpuApi, cpuALU)

  return cpuApi
}
