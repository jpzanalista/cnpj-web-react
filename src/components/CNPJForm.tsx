import { useState, type FormEvent } from 'react'
import { formatCNPJ, normalizeCNPJ } from '../lib/format'

interface Props {
  loading: boolean
  onSubmit: (cnpj: string) => void
}

function CNPJForm({ loading, onSubmit }: Props) {
  const [input, setInput] = useState('')
  const normalized = normalizeCNPJ(input)
  const isValid = normalized.length === 14

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isValid) onSubmit(normalized)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(formatCNPJ(e.target.value))}
        placeholder="00.000.000/0000-00"
        maxLength={18}
        className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
      />
      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full sm:w-auto rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 transition-colors"
      >
        {loading ? 'Consultando...' : 'Consultar'}
      </button>
    </form>
  )
}

export default CNPJForm
