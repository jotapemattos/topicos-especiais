import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Consultation } from '../../services/types'
import { useParams } from 'react-router-dom'
import { formatDateForInput } from '../../utils/formatDate'

interface BookAppointmentFormProps {
  initialValue: Consultation | null
}

export function BookAppointmentForm({
  initialValue,
}: BookAppointmentFormProps) {
  const { patientId, consultationId } = useParams() as {
    patientId: string
    consultationId: string
  }

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
        window.location.reload()
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
      alert('Consulta salva com sucesso!')
    } catch (err) {
      console.log(err)
      alert('Erro ao cadastrar consulta. Por favor, tente novamente')
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

  return (
    <div className="patient-consult">
      <div className="register-section">
        <div className="register-container">
          <h2>CADASTRAR NOVA CONSULTA</h2>

          <div className="field-group-row">
            <div className="field-group">
              <label htmlFor="register-date">DATA DA CONSULTA:</label>
              <input
                type="date"
                id="register-date"
                value={formatDateForInput(consultation.consultDate)}
                onChange={(e) =>
                  setConsultation({
                    ...consultation,
                    consultDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="field-group">
              <label htmlFor="register-time">HORÁRIO:</label>
              <input
                type="time"
                id="register-time"
                value={consultation.time}
                onChange={(e) =>
                  setConsultation({
                    ...consultation,
                    time: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="register-pressure">PRESSÃO ARTERIAL:</label>
            <input
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

          <div className="field-group">
            <label htmlFor="register-frequency">FREQUÊNCIA CARDÍACA:</label>
            <input
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

          <div className="field-group">
            <label htmlFor="register-saturation">SATURAÇÃO (%):</label>
            <input
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

          <div className="field-group">
            <label htmlFor="register-glicemia">GLICEMIA:</label>
            <input
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

          <div className="field-group">
            <label htmlFor="register-anamnese">ANAMNESE:</label>
            <input
              type="text"
              id="register-anamnese"
              value={consultation.anamnesis}
              onChange={(e) =>
                setConsultation({
                  ...consultation,
                  anamnesis: e.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label htmlFor="register-duration">DURAÇÃO (em minutos):</label>
            <input
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

          <div className="field-group">
            <label htmlFor="register-cid">CID:</label>
            <input
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

          <div className="field-group">
            <label htmlFor="register-medication">MEDICAÇÃO:</label>
            <input
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

          <div className="field-group-row">
            <div className="field-group">
              <button className="save-button" onClick={handleSave}>
                SALVAR
              </button>
            </div>
            {!initialValue && (
              <div className="field-group">
                <button className="clear-button" onClick={handleClear}>
                  LIMPAR
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
