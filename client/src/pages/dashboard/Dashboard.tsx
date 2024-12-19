import './Dashboard.css'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { GetPatientsResponse, Patient } from '../../services/types'
import PatientCard from '../../components/PatientCard'
import { formatDateForInput } from '../../utils/formatDate'

const AreaMedico = () => {
  const { user } = useAuth()
  const [view, setView] = useState<string>('buscar')
  const [CPF, setCPF] = useState<string>('')
  const [birthdate, setBirthdate] = useState<Date | string>('')
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

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    console.log(inputValue)
    setBirthdate(inputValue)
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post<Patient>(`/${user?.id}/patients`, {
        name,
        cpf: CPF.replace(/\D/g, ''),
        birthDate: birthdate,
        motherName,
      })
      console.log(response)

      // Clear form
      setName('')
      setCPF('')
      setBirthdate('')
      setMotherName('')

      // Show success message or redirect
      setView('buscar')

      // Optionally, refresh the patient list
      handleSearch()
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
      console.log(response)

      const { patients } = response.data

      // Filter patients by name
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

  // Add useEffect to perform initial search or when searchName changes
  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  return (
    <div className="area-medico">
      <Header />

      <div className="tab-container">
        <button
          className={`tab-button ${view === 'buscar' ? 'active' : ''}`}
          onClick={() => setView('buscar')}
        >
          BUSCAR
        </button>
        <button
          className={`tab-button ${view === 'cadastrar' ? 'active' : ''}`}
          onClick={() => setView('cadastrar')}
        >
          CADASTRAR
        </button>
      </div>

      {view === 'buscar' && (
        <div className="search-section">
          <div className="register-container">
            <div className="field-group">
              <input
                type="text"
                id="register-name"
                value={searchName}
                placeholder="Digite o nome do paciente"
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <button
              id="button-search"
              className="button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'BUSCANDO...' : 'BUSCAR'}
            </button>
          </div>

          <div className="patient-list">
            {patients.length === 0 ? (
              <p>Nenhum paciente encontrado.</p>
            ) : (
              patients.map((patient) => (
                <PatientCard patient={patient} key={patient.id} />
              ))
            )}
          </div>
        </div>
      )}

      {view === 'cadastrar' && (
        <div className="register-section">
          <form onSubmit={handleRegister} className="register-inputs">
            <div className="field-group-row">
              <div className="field-group">
                <label htmlFor="register-name">NOME COMPLETO:</label>
                <input
                  type="text"
                  id="register-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="register-cpf">CPF:</label>
                <input
                  type="text"
                  id="register-cpf"
                  className="center-placeholder"
                  value={CPF}
                  onChange={(e) => handleCPFChange(e)}
                  placeholder="___.___.___-__"
                  required
                />
              </div>
            </div>
            <div className="field-group-row">
              <div className="field-group">
                <label htmlFor="register-birthdate">DATA DE NASCIMENTO:</label>
                <input
                  type="date"
                  id="register-birthdate"
                  className="center-placeholder"
                  value={formatDateForInput(birthdate.toString())}
                  onChange={handleBirthdateChange}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="register-mother-name">NOME DA MÃE:</label>
                <input
                  type="text"
                  id="register-mother-name"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AreaMedico
