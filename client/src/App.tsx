import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Patient from './pages/patient/Patient'
import BookAppointment from './pages/book-appointment/BookAppointment'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header' // Import your Header component

// Layout component for routes with header
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AuthLayout>
                  <Dashboard />
                </AuthLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/patient/:id"
            element={
              <PrivateRoute>
                <AuthLayout>
                  <Patient />
                </AuthLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/patient/:patientId/book-appointment/:consultationId"
            element={
              <PrivateRoute>
                <AuthLayout>
                  <BookAppointment />
                </AuthLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
