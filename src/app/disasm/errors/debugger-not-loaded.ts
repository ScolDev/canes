export class DebuggerNotLoaded extends Error {
  constructor () {
    super('Debugger has not been initialized.')
    this.name = 'Debugger Not Loaded Error'
  }
}
