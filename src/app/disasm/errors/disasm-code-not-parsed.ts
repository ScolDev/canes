export class DisASMCodeNotParsed extends Error {
  constructor () {
    super('Dissasembly code has not been parsed.')
    this.name = 'Disassembly Code Not Parsed Error'
  }
}
