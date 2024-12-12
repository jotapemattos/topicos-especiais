import { FaArrowLeft, FaUser, FaSignOutAlt } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

const Header = ({ title, profileName, onBack }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownOpen && !e.target.closest(".profile")) {
        closeDropdown();
      }
    };
  
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen]);
  

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/") 
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".profile")) {
        closeDropdown();
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <header className="header">
      <div className="header-left">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h1>{title}</h1>
      </div>

      <div className="header-right">
        <div className="profile">
          <span>{profileName}</span>
          <div className="profile-icon" onClick={toggleDropdown}>
            <FaUser />
          </div>

          {dropdownOpen && (
            <div className={`profile-dropdown ${dropdownOpen ? "open" : ""}`}>
              <button className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;