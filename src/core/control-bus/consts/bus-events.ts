export enum NESBusRequests {
  AddCPUExtraCycles = 'AddCPUExtraCycles',
  Execute = 'Execute',
  GetInstructionSize = 'GetInstructionSize',
  GetPCRegister = 'GetPCRegister',
  GetRegister = 'GetRegister',
  GetSignedByte = 'GetSignedByte',
  Load = 'load',
  LoadWord = 'LoadWord',
  LoadByAddressingMode = 'LoadByAddressingMode',
  SetFlag = 'SetFlag',
  SetLastWrite = 'SetLastWrite',
  SetRegister = 'SetRegister',
  Store = 'Store',
  StoreByAddressingMode = 'StoreByAddressingMode',
  IsDebugMode = 'IsDebugMode',
  HasCrossedPage = 'HasCrossedPage',
  HasExtraCycle = 'HasExtraCycle'
}
