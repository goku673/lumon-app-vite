
import { useState, useRef, useEffect } from "react"
import PersonIcon from "@mui/icons-material/Person"
import LogoutIcon from "@mui/icons-material/Logout"
import SettingsIcon from "@mui/icons-material/Settings"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"

const UserProfile = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    setIsDropdownOpen(false)
    onLogout()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
          {getInitials(user.name)}
        </div>

        <div className="flex flex-col items-start">
          <span className="text-gray-900 font-semibold text-sm leading-tight">{user.name}</span>
          <span className="text-gray-500 text-xs leading-tight">{user.email}</span>
        </div>

        {isDropdownOpen ? (
          <ExpandLessIcon className="w-4 h-4 text-gray-400" />
        ) : (
          <ExpandMoreIcon className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                {user.is_admin === 1 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

        
          <div className="border-t border-gray-100 my-1"></div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            <LogoutIcon className="w-4 h-4 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  )
}

export default UserProfile;
