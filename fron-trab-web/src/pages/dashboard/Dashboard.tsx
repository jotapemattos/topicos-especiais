import './Dashboard.css'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { GetPatientsResponse, Patient } from '../../services/types'

const AreaMedico = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [view, setView] = useState<string>('informacoes')
  const [CPF, setCPF] = useState<string>('')
  const [birthdate, setBirthdate] = useState<Date | string>('')
  const [name, setName] = useState<string>('')
  const [motherName, setMotherName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchName, setSearchName] = useState<string>('')

  const handleHistorico = (patient: Patient) => {
    navigate(`/patient/${patient.id}`)
  }

  const handleNovaConsulta = () => {
    navigate('/book-appointment')
  }

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

    // Format the input to match DD/MM/YYYY
    const formattedInput = inputValue
      .replace(/\D/g, '') // Remove non-digit characters
      .slice(0, 8) // Limit to 8 digits
      .replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3') // Add slashes

    // When input is complete, convert to Date object
    if (formattedInput.length === 10) {
      const [day, month, year] = formattedInput.split('/')
      const formattedDate = new Date(`${year}-${month}-${day}`)
      setBirthdate(formattedDate)
    } else {
      setBirthdate(inputValue)
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post<Patient>(`/${user?.id}/patients`, {
        name,
        cpf: CPF.replace(/\D/g, ''),
        birthDate:
          birthdate instanceof Date
            ? birthdate.toISOString().split('T')[0]
            : '',
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
              <label htmlFor="register-name">NOME COMPLETO:</label>
              <input
                type="text"
                id="register-name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div className="field-group-row">
              <button
                id="button-search"
                className="button"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'BUSCANDO...' : 'BUSCAR'}
              </button>
            </div>
          </div>

          <div className="patient-list">
            {patients.length === 0 ? (
              <p>Nenhum paciente encontrado.</p>
            ) : (
              patients.map((patient, index) => (
                <div className="patient-card" key={index}>
                  <div className="patient-info">
                    <h3>{patient.name}</h3>
                    <p>
                      <strong>CPF:</strong> {patient.cpf}
                    </p>
                    <p>
                      <strong>DATA DE NASCIMENTO:</strong> {patient.birthDate}
                    </p>
                    <p>
                      <strong>NOME DA MÃE:</strong> {patient.motherName}
                    </p>
                  </div>

                  <div className="patient-actions">
                    <button className="button" onClick={handleNovaConsulta}>
                      NOVA CONSULTA
                    </button>
                    <button
                      className="button"
                      onClick={() => handleHistorico(patient)}
                    >
                      HISTÓRICO
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {view === 'cadastrar' && (
        <div className="register-section">
          <form onSubmit={handleRegister} className="register-container">
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

            <div className="field-group-row">
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

              <div className="field-group">
                <label htmlFor="register-birthdate">DATA DE NASCIMENTO:</label>
                <input
                  type="text"
                  id="register-birthdate"
                  className="center-placeholder"
                  value={birthdate ? birthdate.toLocaleString('pt-BR') : ''}
                  onChange={handleBirthdateChange}
                  placeholder="DD/MM/AAAA"
                  required
                />
              </div>
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
