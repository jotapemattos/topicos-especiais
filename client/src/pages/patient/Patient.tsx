import React, { useState, useEffect, useRef } from 'react'
import './Patient.css'
import Header from '../../components/Header'
import { useNavigate, useParams } from 'react-router-dom'
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/${user?.id}/consultations/${id}`)
      window.location.reload()
      alert('Consulta deletada com sucesso')
    } catch (err) {
      console.log(err)
      alert('Erro ao deletar consulta. Por favor, tente novamente')
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
    // eslint-disable-next-line
  }, [])

  function formatDateForRendering(dateString: string) {
    const date = new Date(dateString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${day}/${month}/${year}`
  }

  return (
    <div className="historico">
      <Header />

      {patient && <About patient={patient} />}

      <h2>HISTÓRICO DO PACIENTE</h2>
      <div className="consultation-historical">
        {!patient ||
          (patient.consultations.length === 0 && (
            <p>Não há histórico de consultas para este paciente.</p>
          ))}
        {patient &&
          patient.consultations.length > 0 &&
          patient.consultations.map((consultation, index) => (
            <div key={index} className="history-box">
              {isMobile ? (
                <div className="history-details-mobile">
                  <div className="history-header">
                    {formatDateForRendering(consultation.consultDate)}
                    as {consultation.time}
                  </div>
                  <div className="history-list">
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
                </div>
              ) : (
                <div className="history-details">
                  <div className="history-header">
                    <div>
                      <span>
                        {formatDateForRendering(consultation.consultDate)}
                      </span>
                      <span>às</span>
                      <span>{consultation.time}</span>
                    </div>
                    <div className="consultation-actions" ref={dropdownRef}>
                      <div className="dropdown">
                        <button
                          className="dots-button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          aria-label="Menu de ações"
                        >
                          ⋮
                        </button>
                        <div
                          className={`dropdown-content ${isDropdownOpen ? 'active' : ''}`}
                        >
                          <button
                            onClick={() => {
                              navigate(
                                `/patient/${id}/book-appointment/${consultation.id}`,
                              )
                              setIsDropdownOpen(false)
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setIsDeleteDialogOpen(true)
                              setIsDropdownOpen(false)
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`modal ${isDeleteDialogOpen ? 'active' : ''}`}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2>Excluir paciente</h2>
                        <button
                          className="close-button"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          aria-label="Close dialog"
                        >
                          ×
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>Você tem certeza que deseja excluir o paciente?</p>
                      </div>
                      <div className="modal-footer">
                        <button
                          className="cancel-button"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          type="button"
                        >
                          Cancelar
                        </button>
                        <button
                          className="confirm-button-delete"
                          onClick={() => handleDelete(consultation.id)}
                          type="button"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="history-list">
                    <div>
                      <strong>Duração:</strong> {consultation.duration} minutos
                    </div>
                    <div>
                      <strong>Pressão arterial:</strong>{' '}
                      {consultation.bloodPressure}
                    </div>
                    <div>
                      <strong>Frequência:</strong> {consultation.frequency}
                    </div>
                    <div>
                      <strong>Saturação:</strong> {consultation.saturation}%
                    </div>
                    <div>
                      <strong>Glicemia:</strong> {consultation.glycemia}
                    </div>
                    <div>
                      <strong>Código CID:</strong> {consultation.icdCode}
                    </div>
                    <div>
                      <strong>Medicação:</strong> {consultation.medication}
                    </div>
                    <div>
                      <strong>Anamnese:</strong> {consultation.anamnesis}
                    </div>
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
