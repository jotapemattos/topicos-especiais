import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Consultation, GetPatientsResponse } from '../../services/types'
import { BookAppointmentForm } from './BookAppointmentForm'

const BookAppointment = () => {
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const { patientId, consultationId } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get<GetPatientsResponse>(
          `/${user?.id}/patients`,
        )

        const { patients } = response.data

        const filteredPatient = patients.filter((item) => item.id === patientId)
        const filteredConsultation = filteredPatient[0].consultations.filter(
          (item) => item.id === consultationId,
        )
        setConsultation(filteredConsultation[0])
      } catch (err) {
        console.error('Fetch patients error:', err)
      }
    }

    fetchPatients()
    // eslint-disable-next-line
  }, [])

  const handleConsultationChange = (value: Consultation) => {
    setConsultation(value)
  }

  return (
    <div>
      <BookAppointmentForm
        initialValue={consultation}
        onConsultationChange={handleConsultationChange}
      />
    </div>
  )
}

export default BookAppointment
