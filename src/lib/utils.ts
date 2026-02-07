import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const YYYY_MM_DD_REGEX = /^\d{4}-\d{2}-\d{2}/

export function formatDateToYYYYMMDD(value: string | null | undefined): string | null {
  if (value == null || value === '') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (YYYY_MM_DD_REGEX.test(trimmed)) return trimmed.slice(0, 10)
  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) return null
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
