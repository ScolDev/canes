export interface CodeRange {
  numOfLines?: number
  fromLineNumber?: number
  fromAddress?: number
}

export interface DisASMLine {
  readonly asm: string
  readonly address: number
  readonly bytes: number[]
  readonly lineNumber: number
  readonly instruction: {
    opcode: number
    supported: boolean
    operand?: number
  }
}

export interface DisASMNode {
  readonly line: DisASMLine
  readonly ref?: number
}

export interface ParsingOptions {
  baseAddress: number
  endAddress: number
}

export interface NESDisASMCode {
  addLine: (line: DisASMLine) => void
  clear: () => void
  getLineFromAddress: (address: number) => DisASMNode | undefined
  getLineFromLineNumber: (lineNumber: number) => DisASMNode | undefined
  getNumOfLines: () => number
}

export interface NESDisASMComponent {
  getCode: () => NESDisASMCode
  getInstructionASM: (
    instruction: { opcode: number, supported: boolean, operand?: number },
    address?: number
  ) => string
  parse: (options?: ParsingOptions) => Promise<void>
  read: (range: CodeRange) => DisASMNode[]
  setPRG: (prg: Uint8Array) => void
}
