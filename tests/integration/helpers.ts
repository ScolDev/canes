import { readFile } from 'fs/promises'
import { resolve } from 'path'
import path from 'node:path'
import { type CPUAddrMode } from 'src/nes/core/addressing-modes/types'
import { type BaseInstruction } from 'src/nes/core/instructions/base-instruction'
import { CPUInstructionSize } from 'src/nes/core/instructions/consts/instruction-size'
import { CPUMemoryMap } from 'src/nes/core/memory/consts/memory-map'
import { type NESMemoryComponent } from 'src/nes/core/memory/types'
import { OpcodeToAddrMode } from 'src/nes/disasm/consts/opcodes'
import { type DisASMNode } from 'src/nes/disasm/types'
import { type ROMLoader } from 'src/nes/rom/types'

export function storePRG (
  memory: NESMemoryComponent,
  prg: Uint8Array,
  resetVector = 0x8000
): void {
  memory.storeWord(CPUMemoryMap.Reset_Vector, resetVector)
  for (
    let address = resetVector, index = 0;
    index < prg.length;
    address++, index++
  ) {
    memory.store(address, prg[index])
  }
}

export function mapLinesToASM (nodes: DisASMNode[]): string[] {
  return nodes.map(({ line }) => line.asm)
}

export function buildSampleCode (instructions: BaseInstruction[]): Uint8Array {
  const code = instructions
    .map((ins) => {
      return Object.entries(ins.AddressingModes)
        .map(([opcode, addrMode]) => {
          return buildInstructionBytes(Number(opcode), addrMode)
        })
        .flat()
    })
    .flat()

  return Uint8Array.from(code)
}

function buildInstructionBytes (
  opcode: number,
  addrMode: CPUAddrMode
): number[] {
  const size = CPUInstructionSize[addrMode]
  const instructionBytes = [opcode]

  if (size === 2) {
    instructionBytes.push(0x12)
  } else if (size === 3) {
    instructionBytes.push(0x34)
    instructionBytes.push(0x12)
  }

  return instructionBytes
}

export function buildPRGWithAllOpcodes (): Uint8Array {
  return Uint8Array.from(
    Object.entries(OpcodeToAddrMode)
      .map(([_opcode, addrMode]) => {
        const opcode = Number(_opcode)
        return buildInstructionBytes(opcode, addrMode)
      })
      .flat()
  )
}

export class FileLoader implements ROMLoader {
  constructor (private readonly filePath: string) {}

  async getBytes (): Promise<Uint8Array> {
    try {
      return await readFile(resolve(this.filePath))
    } catch (error) {
      throw Error('Cannot load the rom file')
    }
  }
}

export function createROMLoader (): ROMLoader {
  const basePath = '__nes_roms__/instr_test-v5/rom_singles/01-basics.nes'
  const filePath = path.resolve(__dirname, basePath)

  return new FileLoader(filePath)
}
