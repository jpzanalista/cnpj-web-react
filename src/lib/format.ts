export function normalizeCNPJ(raw: string): string {
  return raw.replace(/\D/g, '')
}

/**
 * Formata um CNPJ enquanto o usuario digita.
 * "12345678901234" -> "12.345.678/9012-34"
 * Aceita ate 14 digitos; descarta excesso.
 */
export function formatCNPJ(input: string): string {
  const digits = normalizeCNPJ(input).slice(0, 14)
  const len = digits.length
  if (len === 0) return ''
  if (len <= 2) return digits
  if (len <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (len <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (len <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
}
