import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Patient } from '../services/types'
import './PatientCard.css'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatDateForInput } from '../utils/formatDate'

interface PatientCardProps {
  patient: Patient
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editedPatient, setEditedPatient] = useState(patient)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Handle click outside dropdown
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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put<Patient>(
        `/${user?.id}/patients/${patient.id}`,
        editedPatient,
      )
      window.location.reload()
      alert('Paciente editado com sucesso')
    } catch (err) {
      console.log(err)
      alert('Erro ao editar paciente. Por favor, tente novamente')
    }
    setIsEditModalOpen(false)
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/${user?.id}/patients/${patient.id}`)
      window.location.reload()
      alert('Paciente deletado com sucesso')
    } catch (err) {
      console.log(err)
      alert('Erro ao deletar paciente. Por favor, tente novamente')
    }
    setIsDeleteDialogOpen(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Patient,
  ) => {
    setEditedPatient((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
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
      .replace(/\D/g, '') // Remove non-digit characters
      .replace(/(\d{3})(\d)/, '$1.$2') // Add a dot after the first 3 digits
      .replace(/(\d{3})(\d)/, '$1.$2') // Add a dot after the next 3 digits
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Add a hyphen before the last 2 digits
  }

  return (
    <div className="patient-card">
      <div className="patient-info">
        <div className="card-header">
          <h3>{patient.name}</h3>
          <div className="patient-actions" ref={dropdownRef}>
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
                    setIsEditModalOpen(true)
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
                <button
                  onClick={() => {
                    navigate(`/patient/${patient.id}`)
                    setIsDropdownOpen(false)
                  }}
                >
                  Ver mais
                </button>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>CPF:</strong> {formatCPF(patient.cpf)}
        </p>
        <p>
          <strong>DATA DE NASCIMENTO:</strong>{' '}
          {formatDateForRendering(patient.birthDate)}
        </p>
        <p>
          <strong>NOME DA MÃE:</strong> {patient.motherName}
        </p>
      </div>

      {/* Edit Modal */}
      <div className={`modal ${isEditModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Editar Paciente</h2>
            <button
              className="close-button"
              onClick={() => setIsEditModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleEdit}>
              <div className="field-group">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  type="text"
                  value={editedPatient.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                />
              </div>
              <div className="field-group">
                <label htmlFor="cpf">CPF</label>
                <input
                  id="cpf"
                  type="text"
                  value={formatCPF(editedPatient.cpf)}
                  onChange={(e) => handleInputChange(e, 'cpf')}
                />
              </div>
              <div className="field-group">
                <label htmlFor="birthDate">Data de Nascimento</label>
                <input
                  id="birthDate"
                  type="date"
                  value={formatDateForInput(editedPatient.birthDate)}
                  onChange={(e) => handleInputChange(e, 'birthDate')}
                />
              </div>
              <div className="field-group">
                <label htmlFor="motherName">Nome da Mãe</label>
                <input
                  id="motherName"
                  type="text"
                  value={editedPatient.motherName}
                  onChange={(e) => handleInputChange(e, 'motherName')}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              className="cancel-button"
              onClick={() => setIsEditModalOpen(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="confirm-button-save"
              onClick={handleEdit}
              type="submit"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <div className={`modal ${isDeleteDialogOpen ? 'active' : ''}`}>
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
              onClick={handleDelete}
              type="button"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientCard
