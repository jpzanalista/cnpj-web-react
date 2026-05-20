import type { HistoryItem } from '../hooks/useHistory'
import { formatCNPJ } from '../lib/format'

interface Props {
  items: HistoryItem[]
  onSelect: (cnpj: string) => void
  onClear: () => void
}

function HistoryList({ items, onSelect, onClear }: Props) {
  if (items.length === 0) return null

  return (
    <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Consultas recentes
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-300 underline"
        >
          Limpar
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.cnpj}>
            <button
              type="button"
              onClick={() => onSelect(item.cnpj)}
              className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <span className="block text-sm text-slate-200 truncate">{item.nome}</span>
                <span className="block text-xs text-slate-500 font-mono">
                  {formatCNPJ(item.cnpj)}
                </span>
              </div>
              <span className="text-xs text-slate-500 shrink-0">
                {new Date(item.consultadoEm).toLocaleDateString('pt-BR')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HistoryList
