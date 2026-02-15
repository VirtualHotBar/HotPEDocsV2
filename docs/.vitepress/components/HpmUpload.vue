<template>
  <div class="hpm-upload">
    <div class="area" :class="{ drag, up }" @dragover.prevent="drag = true" @dragleave.prevent="drag = false" @drop.prevent="onDrop">
      <input type="file" ref="fileInput" accept=".hpm,.HPM" @change="onSelect" hidden />

      <div v-if="!file && !up" class="placeholder" @click="openPicker">
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
          <button class="btn sec" @click="reset">重新选择</button>
          <button class="btn pri" :disabled="Boolean(err)" @click="start">开始上传</button>
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
      <button v-if="res.t === 'good'" class="btn sec" @click="reset">继续上传</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { HPM_SHARE } from './hpmShareConfig'

interface ApiResponse<T> {
  code: number
  msg?: string
  data: T
}

interface ShareInfo {
  permissions?: string
}

interface UploadSession {
  session_id: string
  callback_secret: string
  upload_urls: string[]
  completeURL?: string
  chunk_size?: number
  storage_policy: { type: string }
}

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const err = ref<string>('')
const res = ref<{ t: 'good' | 'bad'; m: string } | null>(null)

const drag = ref<boolean>(false)
const up = ref<boolean>(false)
const pct = ref<number>(0)
const text = ref<string>('')
const sub = ref<string>('')

const fmtBytes = (bytes: number, suffix: string): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return `0 B${suffix}`
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i === 0 ? 0 : 2)} ${units[i]}${suffix}`
}
const fmtSize = (b: number): string => fmtBytes(b, '')
const fmtSpeed = (b: number): string => fmtBytes(b, '/s')

const setProgress = (t: string, s = '', p?: number): void => {
  text.value = t
  sub.value = s
  if (typeof p === 'number') pct.value = Math.min(100, Math.max(0, p))
}

const checkName = (n: string): string => {
  if (!/\.hpm$/i.test(n)) return '扩展名必须是 .HPM'
  const base = n.replace(/\.hpm$/i, '')
  const parts = base.split('_')
  if (parts.length !== 4) return `需要4个部分，当前${parts.length}个`
  for (let i = 0; i < 4; i++) if (!parts[i]?.trim()) return `第${i + 1}部分不能为空`
  return ''
}

const openPicker = (): void => {
  if (up.value) return
  fileInput.value?.click()
}

const setFile = (f: File): void => {
  file.value = f
  err.value = checkName(f.name)
  res.value = null
}

const onSelect = (e: Event): void => {
  const input = e.target as HTMLInputElement | null
  const f = input?.files?.[0]
  if (f) setFile(f)
}

const onDrop = (e: DragEvent): void => {
  drag.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) setFile(f)
}

const reset = (): void => {
  file.value = null
  err.value = ''
  res.value = null
  drag.value = false
  up.value = false
  pct.value = 0
  text.value = ''
  sub.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const api = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(HPM_SHARE.apiBase + path, options)
  let json: ApiResponse<T>
  try {
    json = await response.json()
  } catch {
    throw new Error(`请求失败 (${response.status})`)
  }
  if (!response.ok || json.code) throw new Error(json.msg || `请求失败 (${response.status})`)
  return json.data
}

const assertUploadPerm = (permissions?: string): void => {
  if (!permissions) return
  try {
    if (!(atob(permissions).charCodeAt(0) & 4)) throw new Error('分享链接未开启上传权限')
  } catch (e) {
    if (e instanceof Error && e.message === '分享链接未开启上传权限') throw e
    throw new Error('分享权限解析失败')
  }
}

const isS3Type = (type: string): boolean => (HPM_SHARE.s3StorageTypes as readonly string[]).includes(type)

const start = async (): Promise<void> => {
  if (!file.value || err.value) return

  up.value = true
  setProgress('获取分享信息...', '', 0)
  res.value = null

  try {
    const info = await api<ShareInfo>(`/share/info/${HPM_SHARE.shareCode}?count_views=false`)
    assertUploadPerm(info.permissions)

    await upload(file.value)
    res.value = { t: 'good', m: `✅ "${file.value.name}" 上传成功！` }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    res.value = { t: 'bad', m: `❌ ${msg}` }
  } finally {
    up.value = false
  }
}

const upload = async (f: File): Promise<void> => {
  setProgress('创建上传会话...', '', 5)
  const uri = `cloudreve://${HPM_SHARE.shareCode}@share/${encodeURIComponent(f.name)}`

  const s = await api<UploadSession>('/file/upload', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uri, size: f.size, last_modified: Date.now() })
  })

  const type = s.storage_policy.type
  if (type === 'onedrive') return upOneDrive(s, f)
  if (type === 'local') return upRelay(s, f)
  if (isS3Type(type)) return upS3(s, f)
  return upRelay(s, f)
}

const upXhr = (url: string, data: Blob, onProg?: (loaded: number, total: number, speed: number) => void): Promise<string> =>
  new Promise((resolve, reject) => {
    const x = new XMLHttpRequest()
    let lastLoaded = 0
    let lastTime = Date.now()
    let lastEmit = 0

    x.upload.onprogress = e => {
      if (!e.lengthComputable) return
      const now = Date.now()
      const dt = (now - lastTime) / 1e3
      const dLoaded = e.loaded - lastLoaded
      const spd = dt > 0 ? dLoaded / dt : 0
      lastLoaded = e.loaded
      lastTime = now
      if (now - lastEmit < 120 && e.loaded !== e.total) return
      lastEmit = now
      onProg?.(e.loaded, e.total, spd)
    }

    x.onload = () => {
      if (x.status < 300) {
        resolve((x.getResponseHeader?.('ETag') || '').replace(/"/g, '') || '')
      } else {
        reject(new Error(`上传失败 ${x.status}`))
      }
    }
    x.onerror = () => reject(new Error('网络错误'))
    x.open('PUT', url)
    x.send(data)
  })

const upOneDrive = async (s: UploadSession, f: File): Promise<void> => {
  const url = s.upload_urls?.[0]
  if (!url) throw new Error('无上传地址')

  const size = s.chunk_size || HPM_SHARE.defaultChunkSize
  const total = Math.ceil(f.size / size)
  let uploaded = 0
  const startTime = Date.now()
  let lastEmit = 0

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
        const now = Date.now()
        if (now - lastEmit < 120 && e.loaded !== e.total) return
        lastEmit = now

        const totalLoaded = uploaded + e.loaded
        const spd = totalLoaded / ((now - startTime) / 1e3)
        const p = Math.round((totalLoaded / f.size) * 100)
        const left = Math.ceil((f.size - totalLoaded) / (spd || 1))
        setProgress('上传中...', `${p}% · ${fmtSpeed(spd)} · 分片${i + 1}/${total} · 剩余${left}s`, p)
      }

      xhr.onload = () => {
        if (xhr.status < 300) {
          uploaded += chunk.size
          resolve()
        } else {
          reject(new Error(`上传失败 ${xhr.status}`))
        }
      }
      xhr.onerror = () => reject(new Error('网络错误'))
      xhr.send(chunk)
    })
  }

  const cb = await fetch(`${HPM_SHARE.apiBase}/callback/onedrive/${s.session_id}/${s.callback_secret}`, { method: 'POST' })
  if (!cb.ok) throw new Error(`回调失败 (${cb.status})`)
  setProgress('完成', '100%', 100)
}

const upS3 = async (s: UploadSession, f: File): Promise<void> => {
  const size = s.chunk_size || HPM_SHARE.defaultChunkSize
  const total = Math.ceil(f.size / size)
  if (!Array.isArray(s.upload_urls) || s.upload_urls.length < total) throw new Error('分片上传地址不足')

  const etags: Array<{ n: number; etag: string }> = []
  for (let i = 0; i < total; i++) {
    const chunk = f.slice(i * size, Math.min((i + 1) * size, f.size))
    const etag = await upXhr(s.upload_urls[i], chunk, (l, t, spd) => {
      const p = Math.round(((i + l / t) / total) * 100)
      setProgress('上传中...', `${p}% · ${fmtSpeed(spd)} · 分片${i + 1}/${total}`, p)
    })
    etags.push({ n: i + 1, etag })
  }

  setProgress('完成上传...', '99%', 99)
  if (!s.completeURL) throw new Error('缺少 completeURL')
  const xml = `<CompleteMultipartUpload>${etags.map(e => `<Part><PartNumber>${e.n}</PartNumber><ETag>"${e.etag}"</ETag></Part>`).join('')}</CompleteMultipartUpload>`
  const completeResp = await fetch(s.completeURL, { method: 'POST', headers: { 'Content-Type': 'application/xml' }, body: xml })
  if (!completeResp.ok) throw new Error(`合并分片失败 (${completeResp.status})`)

  const cb = await fetch(`${HPM_SHARE.apiBase}/callback/s3/${s.session_id}/${s.callback_secret}`)
  if (!cb.ok) throw new Error(`回调失败 (${cb.status})`)

  setProgress('完成', '100%', 100)
}

const upRelay = async (s: UploadSession, f: File): Promise<void> => {
  const size = s.chunk_size || HPM_SHARE.defaultChunkSize
  const total = Math.ceil(f.size / size)
  const t0 = Date.now()

  for (let i = 0; i < total; i++) {
    const chunk = f.slice(i * size, Math.min((i + 1) * size, f.size))
    const t1 = Date.now()
    await api<void>(`/file/upload/${s.session_id}/${i}`, {
      method: 'POST',
      headers: { 'Content-Length': String(chunk.size) },
      body: chunk
    })

    const p = Math.round(((i + 1) / total) * 100)
    const spd = chunk.size / ((Date.now() - t1) / 1e3)
    const left = Math.ceil((total - i - 1) * ((Date.now() - t0) / 1e3 / (i + 1)))
    setProgress('上传中...', `${p}% · ${fmtSpeed(spd)} · 剩余${left}s (${i + 1}/${total})`, p)
  }

  setProgress('完成', '100%', 100)
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
