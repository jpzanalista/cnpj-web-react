import { useEffect, useRef, useState } from 'react'

export interface CNPJEvent {
  tipo: string
  cnpj: string
  status: string
  consultado_em: string
}

interface UseWebSocketReturn {
  connected: boolean
  lastEvent: CNPJEvent | null
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

/**
 * Conecta no /ws do backend, passa o JWT no query string,
 * e expoe o ultimo evento recebido + estado da conexao.
 *
 * Reconecta automaticamente quando o token muda (login/logout).
 * Fecha a conexao quando o componente desmonta.
 */
export function useWebSocket(token: string | null): UseWebSocketReturn {
  const [connected, setConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<CNPJEvent | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!token) {
      // Sem token: nao abre WS. Se houver conexao anterior, o cleanup
      // do useEffect anterior ja fechou e disparou onclose -> setConnected(false).
      return
    }

    // http://... -> ws://... ; https://... -> wss://...
    const wsUrl = API_URL.replace(/^http/, 'ws') + '/ws?token=' + encodeURIComponent(token)
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = (e) => console.error('WS error:', e)
    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as CNPJEvent
        setLastEvent(event)
      } catch (err) {
        console.error('falha ao parsear evento WS:', err)
      }
    }

    // Cleanup: fecha conexao ao desmontar ou trocar token.
    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [token])

  return { connected, lastEvent }
}
