export default () => {
  const MEM = Array(0xff).fill(0x00)
  const REG = {
    PC: 0x0000,
    SP: 0xFF,
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    P: 0x00
  }

  return {
    MEM,
    REG
  }
}
