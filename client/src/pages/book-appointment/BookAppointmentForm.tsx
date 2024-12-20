import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Consultation } from '../../services/types'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { toast } from 'sonner'

interface BookAppointmentFormProps {
  initialValue: Consultation | null
  onConsultationChange: (consultation: Consultation) => void
}

export function BookAppointmentForm({
  initialValue,
  onConsultationChange,
}: BookAppointmentFormProps) {
  const { patientId, consultationId } = useParams() as {
    patientId: string
    consultationId: string
  }

  const navigate = useNavigate()

  const [consultation, setConsultation] = useState<Consultation>({
    id: '',
    consultDate: new Date().toISOString().slice(0, 10),
    time: '00:00',
    bloodPressure: '',
    frequency: '',
    saturation: 0,
    glycemia: 0,
    anamnesis: '',
    duration: 0,
    icdCode: '',
    medication: '',
    patientId,
  })

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialValue) {
      setConsultation(initialValue)
    }
  }, [initialValue])

  const { user } = useAuth()

  const handleSave = async () => {
    try {
      if (initialValue) {
        await api.put<Consultation>(
          `/${user?.id}/consultations/${consultationId}`,
          {
            ...consultation,
            consultDate: new Date(consultation.consultDate)
              .toISOString()
              .slice(0, 19),
            patientId,
          },
        )
        onConsultationChange(consultation)

        navigate(-1)
        toast.success('Consulta editada com sucesso!')
        return
      }

      await api.post<Consultation>(`/${user?.id}/consultations`, {
        ...consultation,
        consultDate: new Date(consultation.consultDate)
          .toISOString()
          .slice(0, 19),
        patientId,
      })
      setConsultation({
        id: '',
        consultDate: new Date().toISOString().slice(0, 10),
        time: '00:00',
        bloodPressure: '',
        frequency: '',
        saturation: 0,
        glycemia: 0,
        anamnesis: '',
        duration: 0,
        icdCode: '',
        medication: '',
        patientId,
      })
      toast.success('Consulta criada com sucesso!')
      navigate(-1)
    } catch (err) {
      console.log(err)
      setError('Erro ao cadastrar consulta. Por favor, tente novamente')
    }
  }

  const handleClear = () => {
    setConsultation({
      id: '',
      consultDate: new Date().toISOString().slice(0, 10),
      time: '00:00',
      bloodPressure: '',
      frequency: '',
      saturation: 0,
      glycemia: 0,
      anamnesis: '',
      duration: 0,
      icdCode: '',
      medication: '',
      patientId,
    })
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date instanceof Date) {
      setConsultation((prevState) => ({
        ...prevState,
        consultDate: date.toString(),
      }))
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            CADASTRAR NOVA CONSULTA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="register-date">DATA DA CONSULTA</Label>
              <DatePicker
                value={new Date(consultation.consultDate)}
                onChange={handleDateChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-time">HORÁRIO</Label>
              <Input
                type="time"
                id="register-time"
                value={consultation.time}
                onChange={(e) =>
                  setConsultation({
                    ...consultation,
                    time: e.target.value,
                  })
                }
                className="[&:has([aria-])]:bg-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-pressure">PRESSÃO ARTERIAL</Label>
            <Input
              type="text"
              id="register-pressure"
              value={consultation.bloodPressure}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  bloodPressure: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-frequency">FREQUÊNCIA CARDÍACA</Label>
            <Input
              type="text"
              id="register-frequency"
              value={consultation.frequency}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  frequency: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-saturation">SATURAÇÃO (%)</Label>
            <Input
              type="number"
              id="register-saturation"
              value={consultation.saturation}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  saturation: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-glicemia">GLICEMIA</Label>
            <Input
              type="number"
              id="register-glicemia"
              value={consultation.glycemia}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  glycemia: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-anamnese">ANAMNESE</Label>
            <Textarea
              id="register-anamnese"
              value={consultation.anamnesis}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  anamnesis: e.target.value,
                })
              }
              className="resize-none"
              rows={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-duration">DURAÇÃO (em minutos)</Label>
            <Input
              type="number"
              id="register-duration"
              value={consultation.duration}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  duration: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-cid">CID</Label>
            <Input
              type="text"
              id="register-cid"
              value={consultation.icdCode}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  icdCode: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-medication">MEDICAÇÃO</Label>
            <Input
              type="text"
              id="register-medication"
              value={consultation.medication}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  medication: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              Salvar
            </Button>
            {!initialValue && (
              <Button onClick={handleClear} variant="outline">
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
