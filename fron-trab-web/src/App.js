import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import AreaMedico from "./pages/AreaMedico/AreaMedico";
import Historico from "./pages/Historico/Historico";
import NovaConsulta from "./pages/NovaConsulta/NovaConsulta";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/areaMedico"
            element={
              <PrivateRoute>
                <AreaMedico />
              </PrivateRoute>
            }
          />
          <Route
            path="/Historico"
            element={
              <PrivateRoute>
                <Historico />
              </PrivateRoute>
            }
          />
          <Route
            path="/NovaConsulta"
            element={
              <PrivateRoute>
                <NovaConsulta />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;