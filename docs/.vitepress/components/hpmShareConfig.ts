
export const HPM_SHARE = {
  apiBase: "https://pan.sysri.cn/api/v4",
  shareCode: 'rMLHN',
  rootUri: "cloudreve://rMLHN@share/",
  defaultChunkSize: 2 << 20,
  s3StorageTypes: ['s3', 'oss', 'cos', 'obs'] as const
} as const
