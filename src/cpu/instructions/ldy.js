import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xa0: CPU_ADDRESSING_MODES.Immediate,
    0xa4: CPU_ADDRESSING_MODES.ZeroPage,
    0xb4: CPU_ADDRESSING_MODES.ZeroPageX,
    0xac: CPU_ADDRESSING_MODES.Absolute,
    0xbc: CPU_ADDRESSING_MODES.AbsoluteX
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)

    cpu.setRegister(CPU_REGISTERS.Y, memoryValue)
    updateStatus(cpu.getRegister(CPU_REGISTERS.Y))
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (accumulator) => {
    cpuALU.updateZeroFlag(accumulator)
    cpuALU.updateNegativeFlag(accumulator)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `ldy${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
