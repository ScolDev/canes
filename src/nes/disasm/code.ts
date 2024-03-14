import { type NESDisASMCode, type DisASMLine, type DisASMNode } from './types'

export default class Code implements NESDisASMCode {
  private readonly codeByAddress = new Map<number, DisASMNode>()
  private readonly codeByLines: DisASMNode[] = []

  private constructor () {}

  addLine (line: DisASMLine): void {
    const { address, bytes } = line

    if (this.codeByAddress.has(address)) {
      return
    }

    const next = address + bytes.length
    const node = { line, next }

    this.codeByAddress.set(address, node)
    this.codeByLines.push(node)
  }

  clear (): void {
    this.codeByAddress.clear()
    this.codeByLines.splice(0, this.codeByLines.length)
  }

  getLineFromAddress (address: number): DisASMNode | undefined {
    return this.codeByAddress.get(address)
  }

  getLineFromLineNumber (lineNumber: number): DisASMNode | undefined {
    return this.codeByLines[lineNumber - 1]
  }

  getNumOfLines (): number {
    return this.codeByAddress.size
  }

  static create (): NESDisASMCode {
    return new Code()
  }
}
