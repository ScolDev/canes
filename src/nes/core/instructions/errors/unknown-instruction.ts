export class UnknownInstruction extends Error {
  constructor (readonly opcode: number) {
    super(`Trying to execute an unknown instruction (OPCODE: 0x${opcode.toString(16)}).`)
    this.name = 'Unknown Instruction Error'
    this.opcode = opcode
  }
}
