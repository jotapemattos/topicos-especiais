import { FaArrowLeft, FaUser, FaSignOutAlt } from 'react-icons/fa'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (dropdownOpen && !e.target.closest('.profile')) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [dropdownOpen])

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }

  const closeDropdown = () => {
    setDropdownOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (!e.target.closest('.profile')) {
        closeDropdown()
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [dropdownOpen])

  return (
    <header className="header">
      <div className="header-left">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h1>ÁREA DO MÉDICO</h1>
      </div>

      <div className="header-right">
        <div className="profile">
          <div className="profile-icon" onClick={toggleDropdown}>
            <FaUser />
          </div>

          {dropdownOpen && (
            <div className={`profile-dropdown ${dropdownOpen ? 'open' : ''}`}>
              <button className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
