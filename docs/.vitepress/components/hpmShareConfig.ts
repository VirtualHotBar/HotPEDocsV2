const SHARE_CODE = "rMLHN";

export const HPM_SHARE = {
  apiBase: "https://pan.sysri.cn/api/v4",
  shareCode: SHARE_CODE,
  rootUri: "cloudreve://" + SHARE_CODE + "@share/",
  defaultChunkSize: 2 << 20,
  s3StorageTypes: ["s3", "oss", "cos", "obs"] as const,
} as const;
