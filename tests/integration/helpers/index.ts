import { type BaseInstruction } from '../../../src/core/cpu/components/instructions/base-instruction'
import { CPUInstructionSize } from '../../../src/core/cpu/consts/instructions'
import { type CPUInstruction } from '../../../src/core/cpu/types'
import { CPUMemoryMap } from '../../../src/core/memory/consts/memory-map'
import { type NESMemoryComponent } from '../../../src/core/memory/types'
import { type DisASMLine } from '../../../src/nes/components/disasm/types'

export function storePRG (memory: NESMemoryComponent, prg: Uint8Array, resetVector = 0x8000): void {
  memory.storeWord(CPUMemoryMap.Reset_Vector, resetVector)
  for (
    let address = resetVector, index = 0;
    index < prg.length;
    address++, index++
  ) {
    memory.store(address, prg[index])
  }
}

export function mapLinesToASM (lines: DisASMLine[]): string[] {
  return lines.map(line => line.asm)
}

export function buildSampleCode (instructions: BaseInstruction[]): Uint8Array {
  const code = instructions
    .map((ins) => {
      return Object.entries(ins.AddressingModes).map(([opcode, addrMode]) => {
        const size = CPUInstructionSize[addrMode]
        const instructionBytes = [Number(opcode)]

        if (size === 2) {
          instructionBytes.push(0x12)
        } else if (size === 3) {
          instructionBytes.push(0x34)
          instructionBytes.push(0x12)
        }

        return instructionBytes
      })
        .flat()
    })
    .flat()

  return Uint8Array.from(code)
}
