
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  
  type SectionRef = {
    crn: string | number
    subject?: string
    course?: string | number
    section?: string
  }
  
  const props = defineProps<{
    sections: SectionRef[]
    term?: string              // e.g., '202509' (Fall 2025)
    baseUrl?: string           // optional override; defaults to current path
  }>()
  
  const emit = defineEmits<{
    (e: 'import', payload: { term?: string, crns: string[] }): void
  }>()
  
  const copied = ref(false)
  const canShare = computed(() => props.sections && props.sections.length > 0)
  
  function toBase64Url(str: string): string {
    // UTF-8 -> base64url (no padding)
    const utf8 = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
    return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
  }
  
  function fromBase64Url(token: string): string {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : ''
    const bin = atob(b64 + pad)
    const hex = Array.from(bin).map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    return decodeURIComponent(hex)
  }
  
  const payload = computed(() => ({
    v: 1,
    term: props.term,
    crns: (props.sections || []).map(s => String(s.crn))
  }))
  
  const token = computed(() => toBase64Url(JSON.stringify(payload.value)))
  
  const shareUrl = computed(() => {
    const originPath = props.baseUrl || (typeof window !== 'undefined' ? (window.location.origin + window.location.pathname) : '')
    return canShare.value ? `${originPath}?s=${token.value}` : ''
  })
  
  async function copyShareUrl() {
    if (!canShare.value) return
    try {
      await navigator.clipboard.writeText(shareUrl.value)
      copied.value = true
      setTimeout(() => (copied.value = false), 1500)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = shareUrl.value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      copied.value = true
      setTimeout(() => (copied.value = false), 1500)
    }
  }
  
  function openShareUrl() {
    if (!canShare.value) return
    window.open(shareUrl.value, '_blank')
  }
  
  // Import-from-URL detection
  const detectedOnLoad = ref<null | { term?: string, crns: string[] }>(null)
  
  onMounted(() => {
    try {
      const url = new URL(window.location.href)
      const sParam = url.searchParams.get('s') || (url.hash.startsWith('#s=') ? url.hash.slice(3) : null)
      if (sParam) {
        const parsed = JSON.parse(fromBase64Url(sParam))
        if (parsed && parsed.v === 1 && Array.isArray(parsed.crns)) {
          detectedOnLoad.value = { term: parsed.term, crns: parsed.crns }
        }
      }
    } catch (e) {
      // ignore
    }
  })
  
  function emitImport() {
    if (detectedOnLoad.value) {
      emit('import', detectedOnLoad.value)
    }
  }
  </script>
  
  <style scoped>
  button:focus { outline: none; }
  </style>
  