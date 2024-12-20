import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import About from '../../components/About'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import {
  Consultation,
  GetPatientsResponse,
  Patient as PatientType,
} from '../../services/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Activity,
  CalendarClock,
  ClipboardList,
  Clock,
  Droplet,
  Heart,
  MoreVertical,
  Pill,
  Thermometer,
} from 'lucide-react'
import { toast } from 'sonner'

const Patient = () => {
  const { user } = useAuth()
  const [patient, setPatient] = useState<PatientType | null>(null)
  const { id } = useParams()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<string>('')
  const navigate = useNavigate()

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/${user?.id}/consultations/${id}`)
      setPatient((prevPatient) => {
        if (!prevPatient) return null // Ensure we handle the case where prevPatient is null

        return {
          ...prevPatient,
          consultations: prevPatient.consultations?.filter(
            (item) => item.id !== id,
          ),
        }
      })
      toast.success('Consulta deletada com sucesso!')
    } catch (err) {
      toast.error('Erro ao deletar consulta. Por favor, tente novamente')
    }
    setIsDeleteDialogOpen(false)
  }

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get<GetPatientsResponse>(
          `/${user?.id}/patients`,
        )
        const { patients } = response.data
        const filteredPatient = patients.filter((item) => item.id === id)
        setPatient(filteredPatient[0])
      } catch (err) {
        console.error('Fetch patients error:', err)
      }
    }
    fetchPatients()
  }, [user?.id, id])

  function formatDateForRendering(dateString: string) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
  }

  const ConsultationCard = ({
    consultation,
    isMobile,
  }: {
    consultation: Consultation
    isMobile: boolean
  }) => (
    <Card className="mb-4 h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex">
          <CalendarClock className="h-4 w-4 mr-2 text-primary" />
          {formatDateForRendering(consultation.consultDate)} às{' '}
          {consultation.time}
        </CardTitle>
        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/patient/${id}/book-appointment/${consultation.id}`)
                }
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelectedConsultation(consultation.id)
                  setIsDeleteDialogOpen(true)
                }}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p className="text-sm flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Duração: </span>{' '}
              {consultation.duration} minutos
            </p>
            <p className="text-sm flex items-center">
              <Heart className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Pressão arterial: </span>{' '}
              {consultation.bloodPressure}
            </p>
            <p className="text-sm flex items-center">
              <Activity className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Frequência: </span>{' '}
              {consultation.frequency}
            </p>
            <p className="text-sm flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Saturação: </span>{' '}
              {consultation.saturation}%
            </p>
            <p className="text-sm flex items-center">
              <Droplet className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Glicemia: </span>{' '}
              {consultation.glycemia}
            </p>

            <p className="text-sm flex items-center">
              <ClipboardList className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Código CID: </span>{' '}
              {consultation.icdCode}
            </p>
            <p className="text-sm flex items-center">
              <Pill className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Medicação: </span>{' '}
              {consultation.medication}
            </p>
            <p className="text-sm flex items-center">
              <ClipboardList className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Anamnese: </span>{' '}
              {consultation.anamnesis}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-6 space-y-12">
      {patient && <About patient={patient} />}

      <h2 className="text-2xl font-bold mb-6">Histórico do Paciente</h2>

      <div className="space-y-4">
        {!patient || patient.consultations.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Não há histórico de consultas para este paciente.
          </p>
        ) : (
          patient.consultations.map((consultation, index) => (
            <ConsultationCard
              key={index}
              consultation={consultation}
              isMobile={isMobile}
            />
          ))
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir consulta</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir esta consulta?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedConsultation)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Patient
