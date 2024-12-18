import React, { useState, useEffect } from "react";
import "./Historico.css";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import SobrePaciente from "../../components/SobrePaciente";
import { FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Historico = () => {

  const { user } = useAuth();
  const [patient, setPatient] = useState(null)

  const navigate = useNavigate();

  const {id} = useParams()

  console.log(id)

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const historico = [
  //   { medico: "Dr. Fulano", data: "03/11/2024", inicio: "14h", fim: "15h30" },
  //   { medico: "Dra. Amanda", data: "01/05/2024", inicio: "08h", fim: "09h" },
  //   { medico: "Dr. Antonio", data: "24/01/2024", inicio: "11h", fim: "12h30" },
  // ];
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        
        const response = await api.get(`/${user.id}/patients`);
        console.log(response.data);

        const {patients} = response.data

        const filteredPatient = patients.filter(item => item.id === id)

        console.log(filteredPatient)

        setPatient(filteredPatient)
        
        // If you want to set patients or do something with the data
        // setPatients(response.data.patients);
        
      } catch (err) {
        console.error("Fetch patients error:", err);
      } 
    };
  
    fetchPatients();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  

  return (
    <div className="historico">
      <Header title="ÁREA DO MÉDICO" profileName="DR. FULANO" onBack={handleBack} />

      {/* <SobrePaciente /> */}

      <div className="patient-list">
        <h2>HISTÓRICO DO PACIENTE</h2>
        {!patient.consultations || patient.consultations.length === 0 && <p>Não há histórico de consultas para este paciente.</p>}
        {patient.consultations && patient.consultations.length > 0 && patient.consultations.map((item, index) => (
          <div key={index} className="history-box">
            <div className="doctor-info">
              <FaUser className="doctor-icon" />
              <strong>{item.medico}</strong>
            </div>

            {/* Verifica se é mobile para renderizar de forma diferente */}
            {isMobile ? (
              <div className="history-details-mobile">
                <div><strong>DATA:</strong> {item.data}</div>
                <div><strong>INÍCIO:</strong> {item.inicio}</div>
                <div><strong>FIM:</strong> {item.fim}</div>
              </div>
            ) : (
              <>
                <div><strong>DATA:</strong> {item.data}</div>
                <div><strong>INÍCIO:</strong> {item.inicio}</div>
                <div><strong>FIM:</strong> {item.fim}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historico;