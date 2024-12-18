import React, { useState, useEffect } from 'react'
import './Patient.css'
import Header from '../../components/Header'
import { useParams } from 'react-router-dom'
import About from '../../components/About'

import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import {
  GetPatientsResponse,
  Patient as PatientType,
} from '../../services/types'

const Patient = () => {
  const { user } = useAuth()
  const [patient, setPatient] = useState<PatientType | null>(null)

  const { id } = useParams()

  console.log(id)

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

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
    // eslint-disable-next-line
  }, [])

  return (
    <div className="historico">
      <Header />

      {patient && <About patient={patient} />}

      <div className="patient-list">
        <h2>HISTÓRICO DO PACIENTE</h2>
        {!patient ||
          (patient.consultations.length === 0 && (
            <p>Não há histórico de consultas para este paciente.</p>
          ))}
        {patient &&
          patient.consultations.length > 0 &&
          patient.consultations.map((consultation) => (
            <div key={consultation.id} className="history-box">
              {isMobile ? (
                <div className="history-details-mobile">
                  <div>
                    <strong>DATA:</strong> {consultation.consultDate}
                  </div>
                  <div>
                    <strong>HORÁRIO:</strong> {consultation.time}
                  </div>
                  <div>
                    <strong>DURAÇÃO:</strong> {consultation.duration} minutos
                  </div>
                  <div>
                    <strong>PRESSÃO ARTERIAL:</strong>{' '}
                    {consultation.bloodPressure}
                  </div>
                  <div>
                    <strong>FREQUÊNCIA:</strong> {consultation.frequency}
                  </div>
                  <div>
                    <strong>SATURAÇÃO:</strong> {consultation.saturation}%
                  </div>
                  <div>
                    <strong>GLICEMIA:</strong> {consultation.glycemia}
                  </div>
                </div>
              ) : (
                <div className="history-details">
                  <div>
                    <strong>DATA:</strong> {consultation.consultDate}
                  </div>
                  <div>
                    <strong>HORÁRIO:</strong> {consultation.time}
                  </div>
                  <div>
                    <strong>DURAÇÃO:</strong> {consultation.duration} minutos
                  </div>
                  <div>
                    <strong>PRESSÃO ARTERIAL:</strong>{' '}
                    {consultation.bloodPressure}
                  </div>
                  <div>
                    <strong>FREQUÊNCIA:</strong> {consultation.frequency}
                  </div>
                  <div>
                    <strong>SATURAÇÃO:</strong> {consultation.saturation}%
                  </div>
                  <div>
                    <strong>GLICEMIA:</strong> {consultation.glycemia}
                  </div>
                  <div>
                    <strong>CÓDIGO CID:</strong> {consultation.icdCode}
                  </div>
                  <div>
                    <strong>MEDICAÇÃO:</strong> {consultation.medication}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

export default Patient
