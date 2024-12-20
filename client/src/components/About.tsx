import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Patient } from '../services/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface AboutProps {
  patient: Patient
}

const About: React.FC<AboutProps> = ({ patient }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const handleBookAppointment = () => {
    navigate(`/patient/${id}/book-appointment/new`)
  }

  function formatDateForRendering(dateString: string) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
  }

  function formatCPF(cpf: string) {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Sobre o Paciente</CardTitle>
        <Button onClick={handleBookAppointment}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nome Completo
              </p>
              <p className="text-sm">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Data de Nascimento
              </p>
              <p className="text-sm">
                {formatDateForRendering(patient.birthDate)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CPF</p>
              <p className="text-sm">{formatCPF(patient.cpf)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nome da Mãe
              </p>
              <p className="text-sm">{patient.motherName}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default About
