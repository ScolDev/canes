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
