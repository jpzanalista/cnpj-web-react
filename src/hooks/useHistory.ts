import { useState } from 'react'

const STORAGE_KEY = 'cnpj_dev.history'
const MAX_ITEMS = 10

export interface HistoryItem {
  cnpj: string
  nome: string
  consultadoEm: string
}

function readStored(): HistoryItem[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as HistoryItem[]) : []
  } catch {
    return []
  }
}

/**
 * Mantem uma lista dos ultimos CNPJs consultados em localStorage.
 * Limita a MAX_ITEMS, deduplica por CNPJ, e ordena por mais recente.
 */
export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>(readStored)

  const add = (cnpj: string, nome: string) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.cnpj !== cnpj)
      const next = [{ cnpj, nome, consultadoEm: new Date().toISOString() }, ...filtered].slice(
        0,
        MAX_ITEMS
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setItems([])
  }

  return { items, add, clear }
}
