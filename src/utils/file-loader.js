import { resolve } from 'path'
import { readFile } from 'fs/promises'

export const FileLoader = (filePath) => {
  const getBytes = async () => {
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
