import React, { createContext, useState, useContext, useEffect } from 'react'
import { decodeJwt } from 'jose'
import Cookies from 'js-cookie'

// Define the shape of the decoded token
interface DecodedToken {
  exp: number
  id?: string
  email?: string
  name?: string
  [key: string]: any
}

// Define the shape of the context
interface AuthContextType {
  isAuthenticated: boolean
  user: DecodedToken | null
  login: (token: string) => void
  logout: () => void
  loading: boolean
}

// Create the context with a more specific type
const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<DecodedToken | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (token) {
        try {
          if (typeof token !== 'string') {
            throw new Error('Invalid token format: Token must be a string')
          }

          if (!token.includes('.') || token.split('.').length !== 3) {
            throw new Error('Invalid token format: Not a valid JWT structure')
          }

          const decodedToken = decodeJwt(token) as DecodedToken

          if (decodedToken && decodedToken.exp) {
            const currentTime = Date.now() / 1000
            if (currentTime > decodedToken.exp) {
              throw new Error('Token has expired')
            }
            setIsAuthenticated(true)
            setUser(decodedToken)

            Cookies.set('token', token, {
              expires: 7,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            })
            localStorage.setItem('token', token)
          } else {
            throw new Error('Token expired or invalid')
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          Cookies.remove('token')
          localStorage.removeItem('token')
          setIsAuthenticated(false)
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkAuth()

    const interval = setInterval(checkAuth, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return null
  }

  const login = (token: string) => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token format: Token must be a string')
      }

      if (!token.includes('.') || token.split('.').length !== 3) {
        throw new Error('Invalid token format: Not a valid JWT structure')
      }

      const decodedToken = decodeJwt(token) as DecodedToken

      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now() / 1000
        if (currentTime > decodedToken.exp) {
          throw new Error('Token has expired')
        }
        setIsAuthenticated(true)
        setUser(decodedToken)

        Cookies.set('token', token, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        localStorage.setItem('token', token)
      } else {
        throw new Error('Token expired or invalid')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
