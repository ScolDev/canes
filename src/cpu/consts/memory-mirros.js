export const MEMORY_MIRRORS = {
  InternalRAM: {
    start: 0x0000,
    end: 0x2000,
    mirrorSize: 0x800
  },
  PPUIORegisters: {
    start: 0x2000,
    end: 0x4000,
    mirrorSize: 0x08
  }
}
