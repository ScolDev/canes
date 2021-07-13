import CPU from '../src/lib/cpu'

describe('Tests for CPU module.', () => {
  let cpu

  beforeEach(() => {
    cpu = CPU()
  })
  test('should load CPU module.', () => {
    expect(cpu).toBeDefined()
  })

  test('should contain the REG and MEM properties for the Registers and Memory Map.', () => {
    const { REG, MEM } = cpu

    expect(REG).toBeDefined()
    expect(MEM).toBeDefined()
  })
})
