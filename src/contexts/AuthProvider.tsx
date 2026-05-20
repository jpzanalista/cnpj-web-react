import { useState, type ReactNode } from 'react'
import { AuthContext, type User } from './AuthContext'

const STORAGE_TOKEN_KEY = 'cnpj_dev.token'
const STORAGE_USER_KEY = 'cnpj_dev.user'

function readStoredUser(): User | null {
  const stored = localStorage.getItem(STORAGE_USER_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    // JSON corrompido — limpa
    localStorage.removeItem(STORAGE_USER_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_TOKEN_KEY))

  const login = (newUser: User, newToken: string) => {
    setUser(newUser)
    setToken(newToken)
    localStorage.setItem(STORAGE_TOKEN_KEY, newToken)
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_TOKEN_KEY)
    localStorage.removeItem(STORAGE_USER_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
