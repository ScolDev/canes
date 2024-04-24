import { type ROMLoader } from 'src/nes/rom/types'

export class ROMFileLoader implements ROMLoader {
  constructor (private readonly romFile: File) {}

  async getBytes (): Promise<Uint8Array> {
    return await new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        const result = fileReader.result
        const buffer = new Uint8Array(result as ArrayBuffer)

        resolve(buffer)
      }

      fileReader.onerror = () => {
        reject(new Error('Error laoding the rom file.'))
      }

      fileReader.readAsArrayBuffer(this.romFile)
    })
  }
}
