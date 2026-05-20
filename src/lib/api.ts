const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface ApiError {
  status: number
  message: string
  body?: unknown
}

interface ApiOptions extends Omit<RequestInit, 'body'> {
  token?: string | null
  // Aceita objeto (vai JSON.stringify) ou string crua.
  body?: unknown
}

/**
 * Wrapper sobre fetch:
 * - Prefixa com VITE_API_URL
 * - Adiciona Authorization: Bearer <token> se fornecido
 * - Define Content-Type: application/json por padrão
 * - JSON.stringify automático no body (se for objeto)
 * - Parseia JSON da response
 * - Joga ApiError em status >= 400
 */
export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options

  const allHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }

  if (token) {
    allHeaders['Authorization'] = `Bearer ${token}`
  }

  const fetchBody =
    body === undefined || body === null
      ? undefined
      : typeof body === 'string'
        ? body
        : JSON.stringify(body)

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: allHeaders,
    body: fetchBody,
  })

  // Tenta parsear JSON da response (backend retorna JSON mesmo em erros).
  let parsedBody: unknown = null
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    parsedBody = await res.json().catch(() => null)
  }

  if (!res.ok) {
    const message =
      parsedBody && typeof parsedBody === 'object' && 'erro' in parsedBody
        ? String((parsedBody as { erro: unknown }).erro)
        : `HTTP ${res.status}`
    const err: ApiError = {
      status: res.status,
      message,
      body: parsedBody,
    }
    throw err
  }

  return parsedBody as T
}
