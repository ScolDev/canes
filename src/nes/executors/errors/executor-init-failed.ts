export class ExecutorInitFailed extends Error {
  constructor () {
    super('Could not create the CPU executor.')
    this.name = 'Executor Init Failed Error'
  }
}
