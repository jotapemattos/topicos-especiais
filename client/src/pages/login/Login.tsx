import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Stethoscope } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await api.post('/login', {
        email,
        password,
      })

      const data = await response.data
      const token = data.accessToken

      // Use the login function from AuthContext
      login(token)

      // Navigate to dashboard after successful login
      navigate('/dashboard')
    } catch (error) {
      setError('Erro durante o login. Por favor, tente novamente.')
    }
  }

  return (
    <div className="login-page flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Login Médico</CardTitle>
          </div>
          <CardDescription>
            Insira seu e-mail e senha para acessar sua conta
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="error-message text-red-500 text-sm">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="medico@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
