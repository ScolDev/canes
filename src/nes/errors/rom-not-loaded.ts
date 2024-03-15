export class ROMNotLoaded extends Error {
  constructor () {
    super('Could not load the ROM.')
    this.name = 'ROM Not Loaded Error'
  }
}
