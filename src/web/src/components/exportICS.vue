<template>
  <button
    class="px-4 py-2 rounded-2xl shadow hover:shadow-md transition font-medium bg-indigo-600 text-white disabled:opacity-50"
    :disabled="!events || events.length === 0"
    @click="exportIcs"
  >
    Export Schedule (.ics)
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type DayCode = 'SU'|'MO'|'TU'|'WE'|'TH'|'FR'|'SA'

interface ScheduleEvent {
  id?: string | number
  title: string                 // e.g., "CSCI-1200 Data Structures (L01)"
  location?: string             // e.g., "Sage 3303"
  description?: string          // optional long text
  days: DayCode[]               // e.g., ['MO','WE','FR']
  startDate: string             // ISO date, e.g., '2025-08-25'
  endDate: string               // ISO date, e.g., '2025-12-10'
  startTime: string             // 'HH:MM' 24h
  endTime: string               // 'HH:MM' 24h
  timezone?: string             // IANA tz, default 'America/New_York'
}

const props = defineProps<{
  events: ScheduleEvent[]
  filename?: string
  timezone?: string
}>()

const tz = computed(() => props.timezone || 'America/New_York')
const fileName = computed(() => props.filename || 'schedule.ics')

function pad(n: number) { return n < 10 ? `0${n}` : String(n) }

function parseDate(d: string) {
  // 'YYYY-MM-DD' -> {y,m,d}
  const [y,m,day] = d.split('-').map(Number)
  return { y, m, d: day }
}

function localDateTimeString(date: Date) {
  // Returns YYYYMMDDTHHMMSS in local time
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) + 'T' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  )
}

function makeDateAtLocal(ymd: string, hm: string, tzid: string): Date {
  // We create a local Date respecting DST transitions by constructing a Date from pieces.
  // JS Date has no IANA tz construction without Intl API trickery; to keep things portable,
  // we build a local date assuming the browser timezone matches desired TZ. Most users
  // of this app are in the same TZ as the campus.
  // If you need exact cross-timezone export, wire a server-side generator or use a tz lib.
  const [H, M] = hm.split(':').map(Number)
  const { y, m, d } = parseDate(ymd)
  return new Date(y, m-1, d, H, M, 0)
}

const BYDAY_TO_JS = { SU:0, MO:1, TU:2, WE:3, TH:4, FR:5, SA:6 } as const

function nextOnOrAfter(start: Date, targetDow: number): Date {
  const diff = (targetDow - start.getDay() + 7) % 7
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds())
  d.setDate(start.getDate() + diff)
  return d
}

function escapeText(s?: string) {
  if (!s) return ''
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
}

function foldLines(ics: string) {
  // Fold to 75 octets per RFC 5545 (simplified: 75 chars). Continuation starts with one space.
  return ics.split('\n').map(line => {
    const chunks: string[] = []
    let i = 0
    while (i < line.length) {
      chunks.push(line.slice(i, i + 75))
      i += 75
    }
    return chunks.map((c, idx) => idx === 0 ? c : ' ' + c).join('\n')
  }).join('\n')
}

