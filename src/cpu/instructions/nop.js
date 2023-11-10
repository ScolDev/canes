export default (cpu) => {
  const addressingModes = {
  }

  const execute = (opcode) => {
    const addressingMode = addressingModes[opcode]
    cpu.nextPC(addressingMode)
  }

  return {
    execute
  }
}
