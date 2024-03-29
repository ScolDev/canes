export enum CPUMemoryMap {
  ZeroPage = 0x0000,
  Stack = 0x0100,
  SND_CHN = 0x4015,
  JOY2 = 0x4017,
  PRG_ROM_START = 0x8000,
  PRG_ROM_END = 0xffff,
  Reset_Vector = 0xfffc,
  IRQ_Vector = 0xfffe,
  Size = 0x10000
}
