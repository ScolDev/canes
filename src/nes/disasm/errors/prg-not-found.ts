export class PRGNotFound extends Error {
  constructor () {
    super('The program to be parsed has not been found.')
    this.name = 'PRG Not Found Error'
  }
}
