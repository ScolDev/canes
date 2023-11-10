
import { CPU } from '../../src/cpu/cpu'

import { CPU_REGISTERS } from '../../src/cpu/consts/registers'
import { ALU } from '../../src/cpu/alu'
import { CPU_FLAGS } from '../../src/cpu/consts/flags'

describe('Tests for the PC register after instrucions executions.', () => {
  let cpu
  let cpuALU

  beforeEach(() => {
    cpu = CPU()
    cpuALU = ALU(cpu)
  })

  test('should increase the PC register after ADC instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x69, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0x65, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0x75, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0x6d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0x7d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)

    instruction = [0x79, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800f)

    instruction = [0x61, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8011)

    instruction = [0x71, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8013)
  })

  test('should increase the PC register after AND instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x29, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0x25, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0x35, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0x2d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0x3d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)

    instruction = [0x39, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800f)

    instruction = [0x21, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8011)

    instruction = [0x31, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8013)
  })

  test('should increase the PC register after ASL instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x0a]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)

    instruction = [0x06, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8003)

    instruction = [0x16, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8005)

    instruction = [0x0e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8008)

    instruction = [0x1e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800b)
  })

  test('should increase the PC register after BCC instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x90, 0x05]
    cpuALU.setFlag(CPU_FLAGS.CarryFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    cpuALU.clearFlag(CPU_FLAGS.CarryFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)
  })

  test('should increase the PC register after BCS instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xb0, 0x05]
    cpuALU.clearFlag(CPU_FLAGS.CarryFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    cpuALU.setFlag(CPU_FLAGS.CarryFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)
  })

  test('should increase the PC register after BEQ instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xf0, 0x05]
    cpuALU.clearFlag(CPU_FLAGS.ZeroFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    cpuALU.setFlag(CPU_FLAGS.ZeroFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)
  })

  test('should increase the PC register after BNE instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xd0, 0x05]
    cpuALU.setFlag(CPU_FLAGS.ZeroFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    cpuALU.clearFlag(CPU_FLAGS.ZeroFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)
  })

  test('should increase the PC register after BIT instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x24, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0x2c, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8005)
  })

  test('should increase the PC register after BMI instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x30, 0x05]
    cpuALU.clearFlag(CPU_FLAGS.NegativeFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    cpuALU.setFlag(CPU_FLAGS.NegativeFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)
  })

  test('should increase the PC register after BPL instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x10, 0x05]
    cpuALU.setFlag(CPU_FLAGS.NegativeFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    cpuALU.clearFlag(CPU_FLAGS.NegativeFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)
  })
})
