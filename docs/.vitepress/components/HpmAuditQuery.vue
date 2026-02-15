<template>
  <div class="hpm-audit">
    <div class="box">
      <div class="row">
        <input
          v-model.trim="inputName"
          class="ipt"
          placeholder="输入你投稿的 HPM 文件名（可不带 .HPM）"
          :disabled="loading"
          @keydown.enter.prevent="query"
        />
        <button class="btn pri" :disabled="loading || !inputName" @click="query">
          {{ loading ? '查询中…' : '查询' }}
        </button>
      </div>


      <div v-if="err" class="msg bad">{{ err }}</div>
      <div v-else-if="result" class="msg" :class="result.t">
        <div class="title">{{ result.title }}</div>
        <div v-if="result.detail" class="detail">{{ result.detail }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//规则：根目录=待审核；“审核中”=审核中；“已审核”=已审核（并根据模块商店判断通过/未通过）；分享内未找到则到模块商店查询，存在则视为已通过。


import { computed, ref } from 'vue'
import { HPM_SHARE } from './hpmShareConfig'

interface ApiResponse<T> {
  code: number
  msg?: string
  data: T
}

interface CrFileItem {
  type: 0 | 1
  name: string
  path: string
  created_at?: string
  updated_at?: string
  size?: number
}

interface CrListResponse {
  files: CrFileItem[]
  parent?: CrFileItem
}

interface HpmListItem {
  name: string
}

interface HpmListGroup {
  list?: HpmListItem[]
}

interface HpmListResponse {
  state: string
  data?: HpmListGroup[]
}

interface UiResult {
  t: 'ok' | 'warn' | 'bad'
  title: string
  detail?: string
}

const ROOT_URI = computed(() => HPM_SHARE.rootUri)

const inputName = ref<string>('')
const loading = ref<boolean>(false)
const err = ref<string>('')
const result = ref<UiResult | null>(null)

const shareListCache = new Map<string, CrFileItem[]>()
let shopNameSet: Set<string> | null = null

const api = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(HPM_SHARE.apiBase + path, options)
  let data: ApiResponse<T>
  try {
    data = await response.json()
  } catch {
    throw new Error(`请求失败 (${response.status})`)
  }
  if (!response.ok || data.code) throw new Error(data.msg || `请求失败 (${response.status})`)
  return data.data
}

const listFiles = async (uri: string): Promise<CrFileItem[]> => {
  const cached = shareListCache.get(uri)
  if (cached) return cached
  const params = new URLSearchParams({
    uri,
    page: '0',
    page_size: '2000',
    order_by: 'name',
    order_direction: 'asc'
  })
  const data = await api<CrListResponse>(`/file?${params.toString()}`)
  shareListCache.set(uri, data.files || [])
  return data.files || []
}

const normalizeName = (name: string): string => {
  const n = name.trim()
  if (!n) return ''
  return /\.hpm$/i.test(n) ? n : `${n}.HPM`
}

const findByName = (files: CrFileItem[], target: string): CrFileItem | undefined => {
  const t = target.toLocaleLowerCase()
  return files.find(f => f.type === 0 && f.name.toLocaleLowerCase() === t)
}

const shopKeysForName = (name: string): string[] => {
  const raw = name.trim()
  const base = raw.replace(/\.hpm$/i, '')
  const normalized = normalizeName(raw)
  const keys = [raw, base, normalized].map(s => s.trim().toLocaleLowerCase()).filter(Boolean)
  return Array.from(new Set(keys))
}

const getShopNameSet = async (): Promise<Set<string>> => {
  if (shopNameSet) return shopNameSet
  const response = await fetch('https://api.hotpe.top/API/HotPE/GetHPMList/')
  if (!response.ok) throw new Error(`模块商店接口请求失败 (${response.status})`)
  const data = (await response.json()) as HpmListResponse
  const set = new Set<string>()
  for (const g of data.data || []) {
    for (const it of g.list || []) {
      for (const k of shopKeysForName(it.name)) set.add(k)
    }
  }
  shopNameSet = set
  return set
}

const isInShop = async (name: string): Promise<boolean> => {
  const set = await getShopNameSet()
  return shopKeysForName(name).some(k => set.has(k))
}

const query = async (): Promise<void> => {
  const target = normalizeName(inputName.value)
  if (!target) return

  loading.value = true
  err.value = ''
  result.value = null

  try {
    const rootFiles = await listFiles(ROOT_URI.value)
    const reviewingFolder = rootFiles.find(f => f.type === 1 && f.name === '审核中')
    const reviewedFolder = rootFiles.find(f => f.type === 1 && f.name === '已审核')

    const rootHit = findByName(rootFiles, target)
    if (rootHit) {
      result.value = {
        t: 'warn',
        title: '待审核',
        detail: `已在分享根目录找到：${rootHit.name}`
      }
      return
    }

    if (reviewingFolder) {
      const reviewingFiles = await listFiles(reviewingFolder.path)
      const hit = findByName(reviewingFiles, target)
      if (hit) {
        result.value = {
          t: 'warn',
          title: '审核中',
          detail: `已在“审核中”文件夹找到：${hit.name}`
        }
        return
      }
    }

    if (reviewedFolder) {
      const reviewedFiles = await listFiles(reviewedFolder.path)
      const hit = findByName(reviewedFiles, target)
      if (hit) {
        let pass: boolean | null = null
        try {
          pass = await isInShop(hit.name)
        } catch {
          pass = null
        }

        result.value = {
          t: pass === false ? 'bad' : 'ok',
          title: pass === null ? '已审核（结果未知）' : (pass ? '审核通过' : '审核未通过'),
          detail: pass === null
            ? `已在“已审核”文件夹找到：${hit.name}（模块商店接口暂不可用）`
            : `已在“已审核”文件夹找到：${hit.name}`
        }
        return
      }
    }

    try {
      const inShop = await isInShop(target)
      if (inShop) {
        result.value = {
          t: 'ok',
          title: '审核已通过',
          detail: `分享内未找到：${target}（但已在模块商店找到，视为已通过）`
        }
      } else {
        result.value = {
          t: 'bad',
          title: '未找到',
          detail: '分享与模块商店均未找到该文件名，请确认文件名是否与投稿时一致（含大小写/空格/后缀）。'
        }
      }
    } catch {
      result.value = {
        t: 'bad',
        title: '未找到',
        detail: '分享内未找到该文件名；模块商店接口暂不可用，无法进一步判断。'
      }
    }
  } catch (e: unknown) {
    err.value = e instanceof Error ? e.message : '查询失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.hpm-audit { margin: 16px 0 }
.box { border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); border-radius: 12px; padding: 16px }
.row { display: flex; gap: 10px; align-items: center }
.ipt { flex: 1; min-width: 0; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); outline: none }
.ipt:focus { border-color: var(--vp-c-brand) }
.btn { padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: .2s; white-space: nowrap }
.btn.pri { background: var(--vp-c-brand); color: white }
.btn.pri:hover:not(:disabled) { background: var(--vp-c-brand-dark) }
.btn:disabled { opacity: .55; cursor: not-allowed }
.msg { margin-top: 12px; padding: 12px 14px; border-radius: 10px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider) }
.msg.ok { border-color: var(--vp-c-success); background: var(--vp-c-success-soft) }
.msg.warn { border-color: var(--vp-c-warning); background: var(--vp-c-warning-soft) }
.msg.bad { border-color: var(--vp-c-danger); background: var(--vp-c-danger-soft) }
.title { font-weight: 600; color: var(--vp-c-text-1) }
.detail { margin-top: 6px; font-size: 13px; color: var(--vp-c-text-2) }
</style>
