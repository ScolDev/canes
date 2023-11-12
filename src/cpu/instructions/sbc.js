import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0xe9: CPU_ADDRESSING_MODES.Immediate,
    0xe5: CPU_ADDRESSING_MODES.ZeroPage,
    0xf5: CPU_ADDRESSING_MODES.ZeroPageX,
    0xed: CPU_ADDRESSING_MODES.Absolute,
    0xfd: CPU_ADDRESSING_MODES.AbsoluteX,
    0xf9: CPU_ADDRESSING_MODES.AbsoluteY,
    0xe1: CPU_ADDRESSING_MODES.IndexedIndirect,
    0xf1: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  const execute = (opcode, operand) => {
    const addressingMode = addressingModes[opcode]
    const carryFlag = cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    const memoryValue = cpu.loadByAddressingMode(addressingMode, operand)
    const currentAccumulator = cpu.getRegister(CPU_REGISTERS.A)
    const twoComplement = cpuALU.getTwoComplement(memoryValue)

    const result = cpu.getRegister(CPU_REGISTERS.A) + twoComplement + carryFlag
    cpu.setRegister(CPU_REGISTERS.A, result & 0xff)

    updateStatus(result, memoryValue, currentAccumulator)
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (result, memoryValue, previousAccumulator) => {
    const carryFlag = cpuALU.getSignedByte(result) >= 0x00 ? 1 : 0

    cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    cpuALU.updateZeroFlag(result)
    cpuALU.updateNegativeFlag(result)
    cpuALU.updateOverflowFlag(result, memoryValue, previousAccumulator)
  }

  const getASM = (instruction) => {
    const [opcode, operand] = instruction
    const addressingMode = addressingModes[opcode]
    return `sbc${getASMByAddrMode(addressingMode, operand)}`
  }

  return {
    execute,
    getASM,
    addressingModes
  }
}
