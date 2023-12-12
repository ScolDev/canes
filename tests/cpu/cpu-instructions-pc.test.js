import { CPU } from '../../src/core/cpu/cpu'

import { CPU_REGISTERS } from '../../src/core/cpu/consts/registers'
import { CPU_FLAGS } from '../../src/core/cpu/consts/flags'
import { CPU_MEMORY_MAP } from '../../src/core/memory/consts/memory-map'

describe('Tests for the PC register after instrucions executions.', () => {
  let cpu
  let cpuALU
  let memory

  beforeEach(() => {
    cpu = CPU.create()
    cpuALU = cpu.getComponents().cpuALU
    memory = cpu.getComponents().memory
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

  test('should increase the PC register after BIT instruction has been executed', () => {
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

  test('should increase the PC register after BRK instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x00]
    memory.storeWord(CPU_MEMORY_MAP.IRQ_Vector, 0x1234)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x1234)
  })

  test('should increase the PC register after BVC instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x50, 0x05]
    cpuALU.setFlag(CPU_FLAGS.OverflowFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    cpuALU.clearFlag(CPU_FLAGS.OverflowFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)
  })

  test('should increase the PC register after BVS instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x70, 0x05]
    cpuALU.clearFlag(CPU_FLAGS.OverflowFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    cpuALU.setFlag(CPU_FLAGS.OverflowFlag)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)
  })

  test('should increase the PC register after CLC instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x18]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after CLD instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xd8]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after CLI instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x58]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after CLV instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xb8]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after CMP instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xc9, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xc5, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xd5, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0xcd, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0xdd, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)

    instruction = [0xd9, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800f)

    instruction = [0xc1, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8011)

    instruction = [0xd1, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8013)
  })

  test('should increase the PC register after CPX instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xe0, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xe4, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xec, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8007)
  })

  test('should increase the PC register after CPY instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xc0, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xc4, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xcc, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8007)
  })

  test('should increase the PC register after DEC instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xc6, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xd6, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xce, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8007)

    instruction = [0xde, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800a)
  })

  test('should increase the PC register after DEX instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xca]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after DEY instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x88]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after EOR instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x49, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0x45, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0x55, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0x4d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0x5d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)

    instruction = [0x59, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800f)

    instruction = [0x41, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8011)

    instruction = [0x51, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8013)
  })

  test('should increase the PC register after INC instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xe6, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xf6, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xee, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8007)

    instruction = [0xfe, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800a)
  })

  test('should increase the PC register after INX instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xe8]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after INY instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xc8]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after JMP instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x4c, 0x1234]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x1234)

    instruction = [0x6c, 0x1234]
    memory.storeWord(0x1234, 0x5678)
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x5678)
  })

  test('should increase the PC register after JSR instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x20, 0x1234]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x1234)
  })

  test('should increase the PC register after LDA instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xa9, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xa5, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xb5, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0xad, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0xbd, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)

    instruction = [0xb9, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800f)

    instruction = [0xa1, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8011)

    instruction = [0xb1, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8013)
  })

  test('should increase the PC register after LDX instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xa2, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xa6, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xb6, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0xae, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0xbe, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)
  })

  test('should increase the PC register after LDY instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xa0, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xa4, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xb4, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0xac, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0xbc, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)
  })

  test('should increase the PC register after LSR instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x4a]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)

    instruction = [0x46, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8003)

    instruction = [0x56, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8005)

    instruction = [0x4e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8008)

    instruction = [0x5e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800b)
  })

  test('should increase the PC register after NOP instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xea]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after ORA instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x09, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0x05, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0x15, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0x0d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0x1d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)

    instruction = [0x19, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800f)

    instruction = [0x01, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8011)

    instruction = [0x11, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8013)
  })

  test('should increase the PC register after PHA instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x48]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after PHP instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x08]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after PLA instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x68]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after PLP instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x28]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after ROL instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x2a]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)

    instruction = [0x26, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8003)

    instruction = [0x36, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8005)

    instruction = [0x2e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8008)

    instruction = [0x3e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800b)
  })

  test('should increase the PC register after ROR instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x6a]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)

    instruction = [0x66, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8003)

    instruction = [0x76, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8005)

    instruction = [0x6e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8008)

    instruction = [0x7e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800b)
  })

  test('should increase the PC register after RTI instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x40]
    cpu.setRegister(CPU_REGISTERS.SP, 0xfc)
    memory.storeWord(0x01fd, 0x1234)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x1234)
  })

  test('should increase the PC register after RTS instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x60]
    cpu.setRegister(CPU_REGISTERS.SP, 0xfc)
    memory.storeWord(0x01fd, 0x5432)
    cpu.execute(instruction)

    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x5433)
  })

  test('should increase the PC register after SBC instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0xe9, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0xe5, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0xf5, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8006)

    instruction = [0xed, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8009)

    instruction = [0xfd, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800c)

    instruction = [0xf9, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800f)

    instruction = [0xe1, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8011)

    instruction = [0xf1, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8013)
  })

  test('should increase the PC register after SEC instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x38]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after SED instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xf8]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after SEI instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x78]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after STA instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x85, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0x95, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0x8d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8007)

    instruction = [0x9d, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800a)

    instruction = [0x99, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800d)

    instruction = [0x81, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x800f)

    instruction = [0x91, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8011)
  })

  test('should increase the PC register after STX instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x86, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0x96, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0x8e, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8007)
  })

  test('should increase the PC register after STY instructions has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    let instruction = [0x84, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8002)

    instruction = [0x94, 0x00]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8004)

    instruction = [0x8c, 0x0000]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8007)
  })

  test('should increase the PC register after TAX instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xaa]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after TAY instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xa8]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after TSX instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0xba]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after TXA instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x8a]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after TXS instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x9a]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })

  test('should increase the PC register after TYA instruction has been executed', () => {
    cpu.setRegister(CPU_REGISTERS.PC, 0x8000)

    const instruction = [0x98]
    cpu.execute(instruction)
    expect(cpu.getRegister(CPU_REGISTERS.PC)).toBe(0x8001)
  })
})
