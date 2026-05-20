import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CNPJData } from './CNPJResult'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingBottom: 70,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0f172a',
    lineHeight: 1.5,
  },

  // Header
  header: { marginBottom: 28 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#10b981',
    flex: 1,
    lineHeight: 1.25,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    flexShrink: 0,
  },
  badgeInactive: { color: '#92400e', backgroundColor: '#fef3c7' },
  fantasia: {
    fontSize: 11,
    color: '#475569',
    marginTop: 6,
    fontFamily: 'Helvetica-Oblique',
  },
  cnpj: {
    fontSize: 10,
    color: '#475569',
    marginTop: 6,
    fontFamily: 'Helvetica-Bold',
  },
  headerDivider: {
    marginTop: 14,
    height: 2,
    backgroundColor: '#10b981',
  },

  // Section
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionBar: { width: 3, height: 12, backgroundColor: '#10b981', marginRight: 8 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionBody: { paddingLeft: 11 },

  // Two-column rows
  twoCol: { flexDirection: 'row', flexWrap: 'wrap' },
  colItem: {
    width: '50%',
    paddingRight: 16,
    flexDirection: 'row',
    marginBottom: 6,
  },
  colLabel: { width: 80, color: '#64748b', fontSize: 9 },
  colValue: { flex: 1, fontSize: 10 },

  // Full-width rows
  fullRow: { flexDirection: 'row', marginBottom: 5 },
  fullLabel: { width: 80, color: '#64748b', fontSize: 9 },
  fullValue: { flex: 1, fontSize: 10 },

  // Endereço (multi-linha)
  endLine: { marginBottom: 2, fontSize: 10 },

  // CNAE
  atividade: { marginBottom: 4, fontSize: 10, lineHeight: 1.4 },
  cnaeCode: { fontFamily: 'Helvetica-Bold', color: '#059669' },

  // Sócios
  socio: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  socioName: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  socioQual: { fontSize: 9, color: '#64748b', marginTop: 1 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
  },
})

function formatBRL(value?: string): string | undefined {
  if (!value) return undefined
  const num = parseFloat(value)
  if (isNaN(num)) return value
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDateBR(iso?: string): string {
  // Sem fallback para Date.now() (lint reclama de impuro durante render).
  // Se nao houver consultadoEm, retorna string vazia.
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('pt-BR')
  } catch {
    return ''
  }
}

function ColRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <View style={styles.colItem}>
      <Text style={styles.colLabel}>{label}</Text>
      <Text style={styles.colValue}>{value}</Text>
    </View>
  )
}

function FullRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <View style={styles.fullRow}>
      <Text style={styles.fullLabel}>{label}</Text>
      <Text style={styles.fullValue}>{value}</Text>
    </View>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
  )
}

interface Props {
  data: CNPJData
  consultadoEm?: string
}

export function CNPJPDF({ data, consultadoEm }: Props) {
  const enderecoLinha1 = [data.logradouro, data.numero, data.complemento].filter(Boolean).join(', ')
  const enderecoLinha2 = data.bairro
  const enderecoLinha3 = [
    data.municipio && data.uf ? `${data.municipio} / ${data.uf}` : null,
    data.cep ? `CEP ${data.cep}` : null,
  ]
    .filter(Boolean)
    .join(' — ')

  const dataFormatada = formatDateBR(consultadoEm)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{data.nome || 'CNPJ'}</Text>
            {data.situacao && (
              <Text
                style={
                  data.situacao === 'ATIVA' ? styles.badge : [styles.badge, styles.badgeInactive]
                }
              >
                {data.situacao}
              </Text>
            )}
          </View>
          {data.fantasia && <Text style={styles.fantasia}>{data.fantasia}</Text>}
          <Text style={styles.cnpj}>CNPJ: {data.cnpj}</Text>
          <View style={styles.headerDivider} />
        </View>

        {/* Dados gerais */}
        <View style={styles.section}>
          <SectionTitle>Dados gerais</SectionTitle>
          <View style={styles.sectionBody}>
            <View style={styles.twoCol}>
              <ColRow label="Tipo" value={data.tipo} />
              <ColRow label="Abertura" value={data.abertura} />
              <ColRow label="Porte" value={data.porte} />
              <ColRow label="Capital" value={formatBRL(data.capital_social)} />
            </View>
            <FullRow label="Natureza" value={data.natureza_juridica} />
          </View>
        </View>

        {/* Endereço */}
        {(enderecoLinha1 || enderecoLinha2 || enderecoLinha3) && (
          <View style={styles.section}>
            <SectionTitle>Endereço</SectionTitle>
            <View style={styles.sectionBody}>
              {enderecoLinha1 && <Text style={styles.endLine}>{enderecoLinha1}</Text>}
              {enderecoLinha2 && <Text style={styles.endLine}>{enderecoLinha2}</Text>}
              {enderecoLinha3 && <Text style={styles.endLine}>{enderecoLinha3}</Text>}
            </View>
          </View>
        )}

        {/* Contato */}
        {(data.email || data.telefone) && (
          <View style={styles.section}>
            <SectionTitle>Contato</SectionTitle>
            <View style={styles.sectionBody}>
              <View style={styles.twoCol}>
                <ColRow label="Email" value={data.email} />
                <ColRow label="Telefone" value={data.telefone} />
              </View>
            </View>
          </View>
        )}

        {/* Atividade principal */}
        {data.atividade_principal && data.atividade_principal.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Atividade principal</SectionTitle>
            <View style={styles.sectionBody}>
              {data.atividade_principal.map((a, i) => (
                <Text key={i} style={styles.atividade}>
                  <Text style={styles.cnaeCode}>{a.code}</Text>
                  {'  '}
                  {a.text}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Sócios */}
        {data.qsa && data.qsa.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>{`Quadro de sócios (${data.qsa.length})`}</SectionTitle>
            <View style={styles.sectionBody}>
              {data.qsa.map((s, i) => (
                <View key={i} style={styles.socio}>
                  <Text style={styles.socioName}>{s.nome}</Text>
                  <Text style={styles.socioQual}>{s.qual}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Atividades secundárias */}
        {data.atividades_secundarias && data.atividades_secundarias.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>
              {`Atividades secundárias (${data.atividades_secundarias.length})`}
            </SectionTitle>
            <View style={styles.sectionBody}>
              {data.atividades_secundarias.map((a, i) => (
                <Text key={i} style={styles.atividade}>
                  <Text style={styles.cnaeCode}>{a.code}</Text>
                  {'  '}
                  {a.text}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Footer com paginação */}
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            dataFormatada
              ? `Gerado em ${dataFormatada}  ·  Página ${pageNumber} de ${totalPages}  ·  CNPJ.dev`
              : `Página ${pageNumber} de ${totalPages}  ·  CNPJ.dev`
          }
        />
      </Page>
    </Document>
  )
}
