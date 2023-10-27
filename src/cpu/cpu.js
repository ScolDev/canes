import { AddressingModes } from './addressing-modes'
import { Instructions } from './instructions'

import { CPU_ADDRESSING_MODES } from './consts/addressing-modes'
import { CPU_REGISTERS } from './consts/registers'
import { CPU_DATA_SIZE } from './consts/data-size'
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

  const setRegister = (register, value) => {
    if (register === CPU_REGISTERS.PC) {
      REG.PC = value & 0xffff
    } else {
      REG[register] = value & 0xff
    }
  }

  const getAddressFromAddressingMode = (addressingMode, operand) => {
    if (addressingMode === CPU_ADDRESSING_MODES.Absolute) {
      return operand
    }

    if (operand & 0x00ff === 0xff) {
      return getMemoryValue(operand) + (getMemoryValue(operand & 0xff00) << 8)
    }

    return getMemoryValueFromAddressingMode(addressingMode, operand)
  }

  const getMemoryValueFromAddressingMode = (addressingMode, operand) => {
    return addressingModes.get(addressingMode, operand)
  }

  const setMemoryValueFromAddressingMode = (addressingMode, value, operand) => {
    addressingModes.set(addressingMode, value, operand)
  }

  const getMemoryValue = (memoryAddress, dataSize = CPU_DATA_SIZE.Byte) => {
    memoryAddress &= 0xffff

    if (dataSize === CPU_DATA_SIZE.Byte) {
      return MEM[memoryAddress]
    }

    return MEM[memoryAddress] + (MEM[memoryAddress + 1] << 8)
  }

  const setMemoryValue = (memoryAddress, memoryValue, dataSize = CPU_DATA_SIZE.Byte) => {
    memoryAddress &= 0xffff
    MEM[memoryAddress] = memoryValue & 0xff

    if (dataSize === CPU_DATA_SIZE.Word) {
      MEM[memoryAddress + 1] = (memoryValue & 0xff00) >> 8
    }
  }

  const execute = (instruction) => {
    instructions.execute(instruction)
  }

  const cpuApi = {
    MEM,
    REG,
    execute,
    getMemoryValue,
    getAddressFromAddressingMode,
    getMemoryValueFromAddressingMode,
    setRegister,
    setMemoryValue,
    setMemoryValueFromAddressingMode
  }

  const cpuALU = ALU(cpuApi)
  const instructions = Instructions(cpuApi, cpuALU)
  const addressingModes = AddressingModes(cpuApi, cpuALU)

  return cpuApi
}