import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './About.css'
import { Patient } from '../services/types'

interface AboutProps {
  patient: Patient
}

const About: React.FC<AboutProps> = ({ patient }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const handleBookAppointment = () => {
    navigate('/book-appointment/' + id)
  }

  return (
    <div>
      <div className="client-content">
        <div className="field-group-row">
          <div className="patient-info">
            <h2>SOBRE O PACIENTE</h2>

            <div>
              <strong>NOME COMPLETO:</strong> {patient.name}
            </div>
            <div>
              <strong>DATA DE NASCIMENTO:</strong> {patient.birthDate}
            </div>
            <div>
              <strong>CPF:</strong> {patient.cpf}
            </div>
            <br />
            <div>
              <strong>NOME DA MÃE:</strong> {patient.motherName}
            </div>
          </div>

          <div className="patient-actions">
            <button className="action-button" onClick={handleBookAppointment}>
              NOVA CONSULTA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
