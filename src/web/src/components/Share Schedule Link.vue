
  
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
  
 