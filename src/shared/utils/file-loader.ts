import { resolve } from 'path'
import { readFile } from 'fs/promises'
import { type ROMLoader } from '../../core/rom/types'

export const FileLoader = (filePath: string): ROMLoader => {
  const getBytes = async (): Promise<Uint8Array> => {
    try {
      return await readFile(resolve(filePath))
    } catch (e) {
      throw Error('Cannot load the rom file')
    }
  }

  return {
    getBytes
  }
}
