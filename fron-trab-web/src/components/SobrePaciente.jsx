import { FaArrowLeft, FaUser, FaSignOutAlt } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SobrePaciente.css";

const SobrePaciente = () => {
    const navigate = useNavigate();

    const patientInfo = {
        nomeCompleto: "Sicrano Oliveira da Silva Mendes",
        cpf: "123.345.567-90",
        dataNascimento: "03/04/1980",
        nomeMae: "Marcela Oliveira da Silva Mendes",
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleHistorico = () => {
        navigate("/Historico"); 
    };

    const handleNovaConsulta = () => {
        navigate("/NovaConsulta"); 
    };

    return (
        <div>
            <div className="client-content">
                <div className="field-group-row">
                    <div className="patient-info">
                        <h2>SOBRE O PACIENTE</h2>

                        <div><strong>NOME COMPLETO:</strong> {patientInfo.nomeCompleto}</div>
                        <div><strong>DATA DE NASCIMENTO:</strong> {patientInfo.dataNascimento}</div>
                        <div><strong>CPF:</strong> {patientInfo.cpf}</div>
                        <br />
                        <div><strong>NOME DA MÃE:</strong> {patientInfo.nomeMae}</div>
                    </div>
                    
                    <div className="patient-actions">
                        <button className="action-button" onClick={handleNovaConsulta}>NOVA CONSULTA</button>
                        <button className="action-button" onClick={handleHistorico}>HISTÓRICO</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SobrePaciente;