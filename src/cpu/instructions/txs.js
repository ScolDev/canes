import { CPU_ADDRESSING_MODES } from '../consts/addressing-modes'
import { CPU_REGISTERS } from '../consts/registers'

export default (cpu, cpuALU) => {
  const addressingModes = {
    0x9a: CPU_ADDRESSING_MODES.Implied
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]
    const currentXRegister = cpu.getRegister(CPU_REGISTERS.X)

    cpu.setRegister(CPU_REGISTERS.SP, currentXRegister)
    updateStatus(cpu.getRegister(CPU_REGISTERS.SP))
    cpu.nextPC(addressingMode)
  }

  const updateStatus = (newXRegister) => {
    cpuALU.updateZeroFlag(newXRegister)
    cpuALU.updateNegativeFlag(newXRegister)
  }

  return {
    execute
  }
}
