import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { GetPatientsResponse, Patient } from '../../services/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import PatientCard from '@/components/PatientCard'
import { toast } from 'sonner'
import { DatePicker } from '@/components/ui/date-picker'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [CPF, setCPF] = useState<string>('')
  const [birthdate, setBirthdate] = useState<Date>(new Date())
  const [name, setName] = useState<string>('')
  const [motherName, setMotherName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchName, setSearchName] = useState<string>('')

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{2})$/, '$1-$2')
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCPF(formatCPF(e.target.value))
  }

  const handleBirthdateChange = (value: Date | undefined) => {
    if (value instanceof Date) {
      setBirthdate(value)
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post<Patient>(`/${user?.id}/patients`, {
        name,
        cpf: CPF.replace(/\D/g, ''),
        birthDate: birthdate,
        motherName,
      })

      // Clear form
      setName('')
      setCPF('')
      setBirthdate(new Date())
      setMotherName('')
      handleSearch()

      toast.success('Paciente criado com sucesso.')
    } catch (err) {
      setError('Erro ao cadastrar paciente. Por favor, tente novamente.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get<GetPatientsResponse>(
        `/${user?.id}/patients`,
      )
      const { patients } = response.data
      const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchName.toLowerCase()),
      )
      setPatients(filteredPatients)
    } catch (err) {
      setError('Erro ao buscar pacientes. Por favor, tente novamente.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id, searchName])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient: Patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient,
      ),
    )
  }

  const handlePatientDelete = (deletedPatient: Patient) => {
    setPatients((prevPatients) =>
      prevPatients.filter(
        (patient: Patient) => patient.id !== deletedPatient.id,
      ),
    )
  }

  // const handleDateChange = (date: Date | undefined) => {
  //   if (date instanceof Date) {
  //     setPatients((prevState) => ({
  //       ...prevState,
  //       birthDate: date.toString(),
  //     }))
  //   }
  // }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Buscar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Buscar Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    type="text"
                    value={searchName}
                    placeholder="Digite o nome do paciente"
                    onChange={(e) => setSearchName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-8">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {patients.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      Nenhum paciente encontrado.
                    </p>
                  ) : (
                    patients.map((patient) => (
                      <PatientCard
                        key={patient.id}
                        patient={patient}
                        onPatientUpdate={handlePatientUpdate}
                        onPatientDelete={handlePatientDelete}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome Completo</Label>
                      <Input
                        id="register-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-cpf">CPF</Label>
                      <Input
                        id="register-cpf"
                        value={CPF}
                        onChange={handleCPFChange}
                        placeholder="___.___.___-__"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-birthdate">
                        Data de Nascimento
                      </Label>
                      <DatePicker
                        value={new Date(birthdate)}
                        onChange={handleBirthdateChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-mother-name">Nome da Mãe</Label>
                      <Input
                        id="register-mother-name"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DoctorDashboard
