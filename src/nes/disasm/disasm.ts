import { CPUAddressingModes } from '../core/addressing-modes/consts/addressing-modes'
import { type CPUAddrMode } from '../core/addressing-modes/types'
import { CPUInstructionSize } from '../core/instructions/consts/instruction-size'
import { CPUMemoryMap } from '../core/memory/consts/memory-map'
import Code from './code'
import {
  AddressingModeToASM,
  OpcodeToASM
} from './consts/asm'
import { OpcodeToAddrMode } from './consts/opcodes'
import { PRGNotFound } from './errors/prg-not-found'
import {
  type CodeRange,
  type NESDisASMComponent,
  type ParsingOptions,
  type NESDisASMCode,
  type DisASMNode
} from './types'

export default class DisASM implements NESDisASMComponent {
  private readonly code: NESDisASMCode
  private prg: Uint8Array | undefined

  private constructor () {
    this.code = Code.create()
  }

  getCode (): NESDisASMCode {
    return this.code
  }

  async parse (
    options: ParsingOptions = {
      baseAddress: CPUMemoryMap.PRG_ROM_START,
      endAddress: CPUMemoryMap.PRG_ROM_END
    }
  ): Promise<void> {
    if (this.code.getNumOfLines() > 0) {
      this.code.clear()
    }

    this.buildCodeFromTopToBottom(this.code, options)
  }

  read ({ numOfLines, fromLineNumber, fromAddress }: CodeRange): DisASMNode[] {
    const lines: DisASMNode[] = []

    let line = 0
    let currentLineNumber = 0
    while (line < numOfLines) {
      let node: DisASMNode | undefined

      if (fromAddress !== undefined && line === 0) {
        node = this.code.getLineFromAddress(fromAddress)
      } else if (fromLineNumber !== undefined) {
        node = this.code.getLineFromLineNumber(fromLineNumber + line)
      } else {
        node = this.code.getLineFromLineNumber(currentLineNumber)
      }

      if (node === undefined) {
        return lines
      }

      lines.push(node)
      currentLineNumber = node.line.lineNumber + 1
      line++
    }

    return lines
  }

  setPRG (prg: Uint8Array): void {
    this.prg = prg
  }

  getInstructionASM (
    instruction: { opcode: number, supported: boolean, operand?: number },
    address?: number
  ): string {
    const { opcode, operand, supported } = instruction

    if (!supported) {
      return '??'
    }

    const addressingMode = OpcodeToAddrMode[opcode]
    const opcodeASM = OpcodeToASM[opcode]

    if (operand === undefined) {
      return opcodeASM
    }

    const operandASM = this.getASMByAddrMode(addressingMode, operand, address)
    const asm = `${opcodeASM} ${operandASM}`

    return asm
  }

  private buildCodeFromTopToBottom (
    code: NESDisASMCode,
    options: ParsingOptions
  ): void {
    if (this.prg === undefined) {
      throw new PRGNotFound()
    }

    const { baseAddress, endAddress } = options

    let index = 0
    let lineNumber = 1
    let address = baseAddress

    while (index < this.prg.length && address <= endAddress) {
      const instBytes = this.fetchInstructionBytes(this.prg, index)
      const instruction = this.fetchInstruction(instBytes)
      const asm = this.getInstructionASM(instruction, address)
      const instSize = instBytes.length

      const line = { asm, address, instruction, bytes: instBytes, lineNumber }
      code.addLine(line)

      lineNumber++
      address += instSize
      index += instSize
    }
  }

  private fetchInstruction (instBytes: number[]): {
    opcode: number
    supported: boolean
    operand?: number
  } {
    const addrMode = OpcodeToAddrMode[instBytes[0]]
    const instruction = {
      opcode: instBytes[0],
      supported: addrMode !== undefined,
      operand: undefined
    }

    if (instBytes.length === 2) {
      return { ...instruction, operand: instBytes[1] }
    }
    if (instBytes.length === 3) {
      return { ...instruction, operand: instBytes[1] + (instBytes[2] << 8) }
    }

    return instruction
  }

  private fetchInstructionBytes (
    prg: Uint8Array,
    baseAddress: number
  ): number[] {
    const opcode = prg[baseAddress]
    const instruction = [opcode]
    const instructionSize = this.getInstructionSize(opcode)

    if (instructionSize >= 0x02) {
      instruction[1] = prg[baseAddress + 1]
    }
    if (instructionSize === 0x03) {
      instruction[2] = prg[baseAddress + 2]
    }

    return instruction
  }

  private getASMByAddrMode (
    addressingMode: CPUAddrMode,
    operand?: number,
    address?: number
  ): string {
    const addrMode = AddressingModeToASM[addressingMode]

    if (
      operand !== undefined &&
      address !== undefined &&
      addressingMode === CPUAddressingModes.Relative
    ) {
      return addrMode(operand, address)
    }

    return operand !== undefined ? addrMode(operand) : addrMode()
  }

  private getInstructionSize (opcode: number): number {
    const addressingMode = OpcodeToAddrMode[opcode]
    return CPUInstructionSize[addressingMode]
  }

  static create (): NESDisASMComponent {
    return new DisASM()
  }
}
