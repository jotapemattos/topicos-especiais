import "./AreaMedico.css";
import React, { useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AreaMedico = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState("informacoes");
  const [CPF, setCPF] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [name, setName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);
  const [searchName, setSearchName] = useState("");
  const handleHistorico = (patient) => {
    navigate("/historical/" + patient.id); 
  };

  const handleNovaConsulta = () => {
    navigate("/NovaConsulta"); 
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2") 
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{2})$/, "$1-$2");
  };

// const formatBirthdate = (value) => {
//   const formatted = value
//     .replace(/\D/g, "") // Remove all non-digit characters
//     .replace(/(\d{2})(\d)/, "$1/$2")
//     .replace(/(\d{2})(\d)/, "$1/$2");

//   if (formatted.length === 10) { // Ensure the date is in MM/DD/YYYY format
//     const [month, day, year] = formatted.split('/');
//     return `${year}-${month}-${day}`; // Return the date in YYYY-MM-DD format
//   }
  
//   return formatted;
// };


  const handleCPFChange = (e) => {
    setCPF(formatCPF(e.target.value));
  };

  const handleBirthdateChange = (e) => {
    const inputValue = e.target.value;
    
    // Format the input to match DD/MM/YYYY
    const formattedInput = inputValue
      .replace(/\D/g, '') // Remove non-digit characters
      .slice(0, 8) // Limit to 8 digits
      .replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3'); // Add slashes
  
    // When input is complete, convert to Date object
    if (formattedInput.length === 10) {
      const [day, month, year] = formattedInput.split('/');
      const formattedDate = new Date(`${year}-${month}-${day}`);
      setBirthdate(formattedDate);
    } else {
      setBirthdate(inputValue);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post(`/${user.id}/patients`, {
        name,
        cpf: CPF.replace(/\D/g, ''), 
        birthDate: birthdate.toISOString().split('T')[0],
        motherName
      });
      console.log(response);
      // Clear form
      setName("");
      setCPF("");
      setBirthdate("");
      setMotherName("");
      
      // Show success message or redirect
      setView("buscar");
      
      // Optionally, refresh the patient list
      handleSearch();
      
    } catch (err) {
      setError("Erro ao cadastrar paciente. Por favor, tente novamente.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/${user.id}/patients`);
      console.log(response);
      
      // Filter patients by name
      const filteredPatients = response.data.patients.filter(patient => 
        patient.name.toLowerCase().includes(name.toLowerCase())
      );
      
      setPatients(filteredPatients);
      
    } catch (err) {
      setError("Erro ao buscar pacientes. Por favor, tente novamente.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="area-medico">
      <Header title="ÁREA DO MÉDICO" profileName="DR. FULANO" onBack={handleBack} />

      <div className="tab-container">
        <button 
          className={`tab-button ${view === "buscar" ? "active" : ""}`}
          onClick={() => setView("buscar")}
        >
          BUSCAR
        </button>
        <button 
          className={`tab-button ${view === "cadastrar" ? "active" : ""}`}
          onClick={() => setView("cadastrar")}
        >
          CADASTRAR
        </button>
      </div>

      {view === "buscar" && (
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
                {loading ? "BUSCANDO..." : "BUSCAR"}
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
                    <p><strong>CPF:</strong> {patient.cpf}</p>
                    <p><strong>DATA DE NASCIMENTO:</strong> {patient.birthdate}</p>
                    <p><strong>NOME DA MÃE:</strong> {patient.motherName}</p>
                  </div>
                  
                  <div className="patient-actions">
                    <button className="button" onClick={handleNovaConsulta}>NOVA CONSULTA</button>
                    <button className="button" onClick={() => handleHistorico(patient)}>HISTÓRICO</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {view === "cadastrar" && (
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
                  onChange={handleCPFChange}
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
                  value={birthdate ? 
                    birthdate.toLocaleDateString('pt-BR') : 
                    ''
                  }  
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
              {loading ? "CADASTRANDO..." : "CADASTRAR"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AreaMedico;