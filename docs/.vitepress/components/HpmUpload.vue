<template>
  <div class="hpm-upload">
    <div class="area" :class="{ drag, up }" @dragover.prevent="drag = true" @dragleave.prevent="drag = false" @drop.prevent="onDrop">
      <input type="file" ref="fileInput" accept=".hpm" @change="onSelect" hidden />

      <div v-if="!file && !up" class="placeholder" @click="triggerFileInput">
        <div class="icon">📦</div>
        <p>点击选择或拖拽 HPM 文件到此处</p>
      </div>

      <div v-if="file && !up" class="preview">
        <div class="info">
          <span class="name">{{ file.name }}</span>
          <span class="size">{{ fmtSize(file.size) }}</span>
        </div>
        <div :class="['tip', err ? 'bad' : 'good']">{{ err || '✅ 格式正确' }}</div>
        <div class="btns">
          <button class="btn sec" :disabled="up" @click="reset">重新选择</button>
          <button class="btn pri" :disabled="!!err || up" @click="start">开始上传</button>
        </div>
      </div>

      <div v-if="up" class="prog">
        <div class="bar">
          <div class="fill" :style="{ width: pct + '%' }"></div>
        </div>
        <p class="text">{{ text }}</p>
        <p class="sub">{{ sub }}</p>
      </div>
    </div>

    <div v-if="res" class="tip" :class="res.t">
      <p>{{ res.m }}</p>
      <button v-if="res.t === 'ok'" class="btn sec" @click="reset">继续上传</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Config {
  apiBase: string
  shareCode: string
  defaultChunkSize: number
  s3StorageTypes: string[]
}

interface UploadSession {
  session_id: string
  callback_secret: string
  storage_policy: {
    type: string
  }
  chunk_size?: number
  upload_urls?: string[]
  completeURL?: string
}

interface Result {
  t: 'ok' | 'bad'
  m: string
}

interface ApiResponse<T> {
  code: number
  msg?: string
  data: T
}

const CONFIG: Config = {
  apiBase: 'https://pan.sysri.cn/api/v4',
  shareCode: 'rMLHN',
  defaultChunkSize: 2 << 20,
  s3StorageTypes: ['s3', 'oss', 'cos', 'obs']
}

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const err = ref<string>('')
const res = ref<Result | null>(null)
const drag = ref<boolean>(false)
const up = ref<boolean>(false)
const pct = ref<number>(0)
const text = ref<string>('')
const sub = ref<string>('')

const fmtSize = (b: number): string => {
  if (!b) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), units.length - 1)
  return `${(b / 1024 ** i).toFixed(2)} ${units[i]}`
}

const fmtSpeed = (b: number): string => {
  if (!b) return '0 B/s'
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), units.length - 1)
  return `${(b / 1024 ** i).toFixed(2)} ${units[i]}`
}

const set = (t: string, s: string = '', p: number | null = null): void => {
  text.value = t
  sub.value = s
  if (p !== null) pct.value = p
}

const checkName = (n: string): string => {
  if (!n.toLowerCase().endsWith('.hpm')) return '扩展名必须是 .HPM'
  return ''
}

const onSelect = (e: Event): void => {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) setFile(target.files[0])
}

const onDrop = (e: DragEvent): void => {
  drag.value = false
  if (e.dataTransfer?.files[0]) setFile(e.dataTransfer.files[0])
}

const setFile = (f: File): void => {
  file.value = f
  err.value = checkName(f.name)
  res.value = null
  pct.value = 0
  text.value = ''
  sub.value = ''
}

const reset = (): void => {
  file.value = null
  err.value = ''
  if (fileInput.value) fileInput.value.value = ''
  res.value = null
  pct.value = 0
}

const triggerFileInput = (): void => {
  if (fileInput.value && !up.value) {
    fileInput.value.click()
  }
}

const getErrMsg = (e: unknown): string => e instanceof Error ? e.message : '上传失败'

const api = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(CONFIG.apiBase + path, options)
  let data: ApiResponse<T>
  try {
    data = await response.json()
  } catch {
    throw new Error(`请求失败 (${response.status})`)
  }
  if (!response.ok || data.code) throw new Error(data.msg || `请求失败 (${response.status})`)
  return data.data
}

const requestOk = async (url: string, options?: RequestInit): Promise<void> => {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(`请求失败 (${response.status})`)
}

const checkPerm = (permission: string): void => {
  if (!permission) return
  let decoded = ''
  try {
    decoded = atob(permission)
  } catch {
    throw new Error('分享权限字段异常，无法解析')
  }
  if (!(decoded.charCodeAt(0) & 4)) {
    throw new Error('分享链接未开启上传权限')
  }
}

const start = async (): Promise<void> => {
  if (!file.value || err.value || up.value) return
  up.value = true
  set('获取分享信息...', '', 0)
  res.value = null
  try {
    const shareInfo = await api<{ permissions: string }>(`/share/info/${CONFIG.shareCode}?count_views=false`)
    checkPerm(shareInfo.permissions)
    await upload(file.value)
    res.value = { t: 'ok', m: `✅ "${file.value.name}" 上传成功！` }
  } catch (e: unknown) {
    res.value = { t: 'bad', m: `❌ ${getErrMsg(e)}` }
  } finally {
    up.value = false
  }
}

const upload = async (f: File): Promise<void> => {
  set('创建上传会话...', '', 5)
  const uri = `cloudreve://${CONFIG.shareCode}@share/${encodeURIComponent(f.name)}`
  const session = await api<UploadSession>('/file/upload', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uri, size: f.size, last_modified: Date.now() })
  })
  const type = session.storage_policy.type
  const handlers: Record<string, (s: UploadSession, f: File) => Promise<void>> = {
    onedrive: upOneDrive,
    local: upRelay
  }
  if (handlers[type]) {
    await handlers[type](session, f)
  } else if (CONFIG.s3StorageTypes.includes(type)) {
    await upS3(session, f)
  } else {
    await upRelay(session, f)
  }
}

const upXhr = (url: string, data: Blob, onProg?: (loaded: number, total: number, spd: number) => void): Promise<string | null> =>
  new Promise((res, rej) => {
    const x = new XMLHttpRequest()
    let lastLoaded = 0
    let lastTick = Date.now()
    x.upload.onprogress = e => {
      if (!e.lengthComputable) return
      const now = Date.now()
      const elapsed = Math.max((now - lastTick) / 1e3, 0.001)
      const spd = (e.loaded - lastLoaded) / elapsed
      onProg?.(e.loaded, e.total, spd)
      lastLoaded = e.loaded
      lastTick = now
    }
    x.onload = () => x.status < 300 ? res(x.getResponseHeader?.('ETag')?.replace(/"/g, '') || null) : rej(`上传失败 ${x.status}`)
    x.onerror = () => rej('网络错误')
    x.open('PUT', url)
    x.send(data)
  })

const upOneDrive = async (s: UploadSession, f: File): Promise<void> => {
  const url = s.upload_urls?.[0]
  if (!url) throw new Error('无上传地址')
  const size = s.chunk_size || CONFIG.defaultChunkSize
  const total = Math.ceil(f.size / size)
  let uploaded = 0
  const startTime = Date.now()
  for (let i = 0; i < total; i++) {
    const start = i * size
    const end = Math.min((i + 1) * size, f.size)
    const chunk = f.slice(start, end)
    const range = `bytes ${start}-${end - 1}/${f.size}`
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', url)
      xhr.setRequestHeader('Content-Range', range)
      xhr.setRequestHeader('Content-Type', 'application/octet-stream')
      xhr.upload.onprogress = e => {
        if (!e.lengthComputable) return
        const chunkLoaded = e.loaded
        const totalLoaded = uploaded + chunkLoaded
        const elapsed = Math.max((Date.now() - startTime) / 1e3, 1)
        const spd = totalLoaded / elapsed
        const p = Math.round(totalLoaded / f.size * 100)
        const left = Math.ceil((f.size - totalLoaded) / (spd || 1))
        set('上传中...', `${p}% · ${fmtSpeed(spd)} · 分片${i + 1}/${total} · 剩余${left}s`, p)
      }
      xhr.onload = () => {
        if (xhr.status < 300) {
          uploaded += chunk.size
          resolve()
        } else {
          reject(`上传失败 ${xhr.status}`)
        }
      }
      xhr.onerror = () => reject('网络错误')
      xhr.send(chunk)
    })
  }
  await requestOk(`${CONFIG.apiBase}/callback/onedrive/${s.session_id}/${s.callback_secret}`, { method: 'POST' })
  set('完成', '100%', 100)
}

interface EtagInfo {
  n: number
  etag: string | null
}

const upS3 = async (s: UploadSession, f: File): Promise<void> => {
  if (!s.upload_urls?.length || !s.completeURL) throw new Error('S3 上传会话信息不完整')
  const size = s.chunk_size || CONFIG.defaultChunkSize
  const total = Math.ceil(f.size / size)
  const etags: EtagInfo[] = []
  for (let i = 0; i < total; i++) {
    const chunk = f.slice(i * size, Math.min((i + 1) * size, f.size))
    const etag = await upXhr(s.upload_urls![i], chunk, (l, t, spd) => {
      const p = Math.round(((i + l / t) / total) * 100)
      set('上传中...', `${p}% · ${fmtSpeed(spd)} · 分片${i + 1}/${total}`, p)
    })
    etags.push({ n: i + 1, etag })
  }
  set('完成上传...', '99%', 99)
  const xml = `<CompleteMultipartUpload>${etags.map(e => `<Part><PartNumber>${e.n}</PartNumber><ETag>"${e.etag}"</ETag></Part>`).join('')}</CompleteMultipartUpload>`
  await requestOk(s.completeURL, { method: 'POST', headers: { 'Content-Type': 'application/xml' }, body: xml })
  await requestOk(`${CONFIG.apiBase}/callback/s3/${s.session_id}/${s.callback_secret}`)
  set('完成', '100%', 100)
}

const upRelay = async (s: UploadSession, f: File): Promise<void> => {
  const size = s.chunk_size || CONFIG.defaultChunkSize
  const total = Math.ceil(f.size / size)
  const t0 = Date.now()
  for (let i = 0; i < total; i++) {
    const chunk = f.slice(i * size, Math.min((i + 1) * size, f.size))
    const t1 = Date.now()
    await api<unknown>(`/file/upload/${s.session_id}/${i}`, {
      method: 'POST',
      headers: { 'Content-Length': String(chunk.size) },
      body: chunk
    })
    const p = Math.round((i + 1) / total * 100)
    const spd = chunk.size / ((Date.now() - t1) / 1e3)
    const left = Math.ceil((total - i - 1) * ((Date.now() - t0) / 1e3 / (i + 1)))
    set('上传中...', `${p}% · ${fmtSpeed(spd)} · 剩余${left}s (${i + 1}/${total})`, p)
  }
  set('完成', '100%', 100)
}

</script>

<style scoped>
.hpm-upload { margin: 20px 0 }
.area { border: 2px dashed var(--vp-c-divider); border-radius: 12px; padding: 40px; text-align: center; transition: .3s; position: relative; min-height: 200px; display: flex; align-items: center; justify-content: center }
.area.drag, .area.up { border-color: var(--vp-c-brand); background: var(--vp-c-bg-soft) }
.placeholder { cursor: pointer }
.icon { font-size: 48px; margin-bottom: 16px }
.placeholder p { margin: 8px 0; color: var(--vp-c-text-1); font-size: 16px }
.preview { width: 100% }
.info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px 16px; background: var(--vp-c-bg); border-radius: 8px }
.name { font-weight: 500; color: var(--vp-c-text-1) }
.size { font-size: 14px; color: var(--vp-c-text-2) }
.tip { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; text-align: center }
.tip.bad { color: var(--vp-c-danger); background: var(--vp-c-danger-soft) }
.tip.good { color: var(--vp-c-success); background: var(--vp-c-success-soft) }
.btns { display: flex; gap: 12px; justify-content: center }
.btn { padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: .2s }
.btn.pri { background: var(--vp-c-brand); color: white }
.btn.pri:hover:not(:disabled) { background: var(--vp-c-brand-dark) }
.btn.pri:disabled { opacity: .5; cursor: not-allowed }
.btn.sec { background: var(--vp-c-bg); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider) }
.btn.sec:hover { background: var(--vp-c-bg-soft) }
.prog { width: 100% }
.bar { height: 8px; background: var(--vp-c-bg); border-radius: 4px; overflow: hidden; margin-bottom: 16px }
.fill { height: 100%; background: var(--vp-c-brand); transition: width .3s }
.text { font-size: 16px; color: var(--vp-c-text-1); margin-bottom: 8px }
.sub { font-size: 14px; color: var(--vp-c-text-2) }
</style>
