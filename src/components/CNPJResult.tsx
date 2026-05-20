export interface CNPJData {
  cnpj?: string
  nome?: string
  fantasia?: string
  tipo?: string
  status?: string
  situacao?: string
  abertura?: string
  natureza_juridica?: string
  porte?: string
  capital_social?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
  email?: string
  telefone?: string
  qsa?: Array<{ nome: string; qual: string }>
  atividade_principal?: Array<{ code: string; text: string }>
  atividades_secundarias?: Array<{ code: string; text: string }>
  message?: string
}

interface Props {
  data: CNPJData
  consultadoEm?: string
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 text-right">{value}</span>
    </div>
  )
}

function CNPJResult({ data, consultadoEm }: Props) {
  // CNPJ invalido ou nao encontrado pela ReceitaWS
  if (data.status === 'ERROR') {
    return (
      <div className="rounded-md bg-amber-950 border border-amber-900 p-4 text-amber-300">
        {data.message || 'CNPJ não encontrado no cache da ReceitaWS.'}
      </div>
    )
  }

  const endereco = [
    data.logradouro,
    data.numero,
    data.complemento,
    data.bairro,
    data.municipio && data.uf ? `${data.municipio}/${data.uf}` : null,
    data.cep,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-slate-950 border border-slate-800 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-slate-100">{data.nome || 'Sem nome'}</h3>
            {data.fantasia && (
              <p className="text-sm text-slate-400 mt-1">Nome fantasia: {data.fantasia}</p>
            )}
            <p className="text-xs text-slate-500 mt-2 font-mono">CNPJ: {data.cnpj}</p>
          </div>
          {data.situacao && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                data.situacao === 'ATIVA'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}
            >
              {data.situacao}
            </span>
          )}
        </div>
      </div>

      {/* Dados gerais */}
      <div className="rounded-lg bg-slate-950 border border-slate-800 p-6 space-y-3">
        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Dados gerais
        </h4>
        <Row label="Tipo" value={data.tipo} />
        <Row label="Abertura" value={data.abertura} />
        <Row label="Natureza jurídica" value={data.natureza_juridica} />
        <Row label="Porte" value={data.porte} />
        <Row
          label="Capital social"
          value={data.capital_social ? `R$ ${data.capital_social}` : undefined}
        />
      </div>

      {/* Endereço */}
      {endereco && (
        <div className="rounded-lg bg-slate-950 border border-slate-800 p-6">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Endereço
          </h4>
          <p className="text-slate-200">{endereco}</p>
        </div>
      )}

      {/* Contato */}
      {(data.email || data.telefone) && (
        <div className="rounded-lg bg-slate-950 border border-slate-800 p-6 space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Contato
          </h4>
          <Row label="Email" value={data.email} />
          <Row label="Telefone" value={data.telefone} />
        </div>
      )}

      {/* Atividade principal */}
      {data.atividade_principal && data.atividade_principal.length > 0 && (
        <div className="rounded-lg bg-slate-950 border border-slate-800 p-6">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Atividade principal
          </h4>
          {data.atividade_principal.map((a, i) => (
            <div key={i} className="text-slate-200">
              <span className="text-emerald-400 font-mono text-sm mr-2">{a.code}</span>
              {a.text}
            </div>
          ))}
        </div>
      )}

      {/* Sócios (QSA) */}
      {data.qsa && data.qsa.length > 0 && (
        <div className="rounded-lg bg-slate-950 border border-slate-800 p-6">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Quadro de sócios ({data.qsa.length})
          </h4>
          <ul className="space-y-3">
            {data.qsa.map((s, i) => (
              <li key={i}>
                <span className="block text-slate-200">{s.nome}</span>
                <span className="text-xs text-slate-500">{s.qual}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Atividades secundárias */}
      {data.atividades_secundarias && data.atividades_secundarias.length > 0 && (
        <div className="rounded-lg bg-slate-950 border border-slate-800 p-6">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Atividades secundárias ({data.atividades_secundarias.length})
          </h4>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {data.atividades_secundarias.map((a, i) => (
              <li key={i} className="text-sm text-slate-300">
                <span className="text-emerald-400 font-mono text-xs mr-2">{a.code}</span>
                {a.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {consultadoEm && (
        <p className="text-xs text-slate-500 text-right">
          Consultado em: {new Date(consultadoEm).toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  )
}

export default CNPJResult
