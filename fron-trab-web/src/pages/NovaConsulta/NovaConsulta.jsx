import React from "react";
import "./NovaConsulta.css";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import SobrePaciente from "../../components/SobrePaciente";

const NovaConsulta = () => {
    const navigate = useNavigate();

    const handleSave = () => {
        const inputs = document.querySelectorAll("input");
        for (const input of inputs) {
          if (!input.value.trim()) {
            alert(`Preencha todos os campos!`);
            return;
          }
        }
        alert("Consulta salva com sucesso!");
      };
      
      const handleClear = () => {
        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => input.value = "");
      };
      

    const patientInfo = {
        nomeCompleto: "Sicrano Oliveira da Silva Mendes",
        cpf: "123.345.567-90",
        dataNascimento: "03/04/1980",
        nomeMae: "Marcela Oliveira da Silva Mendes",
    };

    const historico = [
        { medico: "Dr. Fulano", data: "03/11/2024", inicio: "14h", fim: "15h30" },
        { medico: "Dra. Amanda", data: "01/05/2024", inicio: "08h", fim: "09h" },
        { medico: "Dr. Antonio", data: "24/01/2024", inicio: "11h", fim: "12h30" },
    ];
    
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="historico">
            <Header title="ÁREA DO MÉDICO" profileName="DR. FULANO" onBack={handleBack} />

            <SobrePaciente />

            <div className="patient-consult">
                <div className="register-section">
                    <div className="register-container">
                    <h2>CADASTRAR NOVA CONSULTA</h2>
                        <div className="field-group-row">
                            <div className="field-group">
                                <label htmlFor="register-pressure">PRESSÃO:</label>
                                <input type="text" id="register-pressure" className="center-placeholder"/>
                            </div>
                            <div className="field-group">
                                <label htmlFor="register-cid">CID:</label>
                                <input type="text" id="register-cid" className="center-placeholder"/>
                            </div>
                        </div>

                        <div className="field-group">
                            <label htmlFor="register-glicemia">GLICEMIA:</label>
                            <input type="text" id="register-glicemia"/>
                        </div>
                        
                        <div className="field-group">
                            <label htmlFor="register-duration">DURAÇÃO:</label>
                            <input type="text" id="register-duration"/>
                        </div>

                        <div className="field-group-row">
                            <div className="field-group">
                                <label htmlFor="register-anamnese">ANAMNESE:</label>
                                <input type="text" id="register-anamnese" className="center-placeholder"/>
                            </div>
                            <div className="field-group">
                                <label htmlFor="register-medication">MEDICAÇÃO:</label>
                                <input type="text" id="register-medication" className="center-placeholder"/>
                            </div>
                        </div>

                        <div className="field-group-row">
                            <div className="field-group">                                
                                <button className="save-button" onClick={handleSave}>SALVAR</button>
                            </div>
                            <div className="field-group">
                                <button className="clear-button" onClick={handleClear}>LIMPAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NovaConsulta;