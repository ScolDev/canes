import { CPU_FLAGS } from '../consts/flags'
import { CPU_REGISTERS } from '../consts/registers'
import { getASMByAddrMode, CPU_ADDRESSING_MODES } from '../consts/addressing-modes'

export class Sbc {
  #cpu = null
  #cpuALU = null

  addressingModes = {
    0xe9: CPU_ADDRESSING_MODES.Immediate,
    0xe5: CPU_ADDRESSING_MODES.ZeroPage,
    0xf5: CPU_ADDRESSING_MODES.ZeroPageX,
    0xed: CPU_ADDRESSING_MODES.Absolute,
    0xfd: CPU_ADDRESSING_MODES.AbsoluteX,
    0xf9: CPU_ADDRESSING_MODES.AbsoluteY,
    0xe1: CPU_ADDRESSING_MODES.IndexedIndirect,
    0xf1: CPU_ADDRESSING_MODES.IndirectIndexed
  }

  constructor (cpu, cpuALU) {
    this.#cpu = cpu
    this.#cpuALU = cpuALU
  }

  execute (opcode, operand) {
    const addressingMode = this.addressingModes[opcode]
    const carryFlag = this.#cpuALU.getFlag(CPU_FLAGS.CarryFlag)
    const memoryValue = this.#cpu.memory.loadByAddressingMode(addressingMode, operand)
    const currentAccumulator = this.#cpu.getRegister(CPU_REGISTERS.A)
    const twoComplement = this.#cpuALU.getTwoComplement(memoryValue)

    const result = this.#cpu.getRegister(CPU_REGISTERS.A) + twoComplement + carryFlag
    this.#cpu.setRegister(CPU_REGISTERS.A, result & 0xff)

    this.updateStatus(result, memoryValue, currentAccumulator)
    this.#cpu.nextPC(addressingMode)
  }

  updateStatus (result, memoryValue, previousAccumulator) {
    const carryFlag = this.#cpuALU.getSignedByte(result) >= 0x00 ? 1 : 0

    this.#cpuALU.setFlag(CPU_FLAGS.CarryFlag, carryFlag)
    this.#cpuALU.updateZeroFlag(result)
    this.#cpuALU.updateNegativeFlag(result)
    this.#cpuALU.updateOverflowFlag(result, memoryValue, previousAccumulator)
  }

  getASM (instruction) {
    const [opcode, operand] = instruction
    const addressingMode = this.addressingModes[opcode]
    return `sbc${getASMByAddrMode(addressingMode, operand)}`
  }
}
