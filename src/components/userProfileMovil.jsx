import React from "react";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Button from "../common/button";
import Text from "../common/text";

const UserProfileMobile = ({ user, onLogout, setIsMenuOpen }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  // const handleLinkClick = () => {
  //   setIsMenuOpen(false)
  // }

  return (
    <div className="border-t border-gray-200 mt-4 pt-4 bg-gray-50 rounded-b-lg">
      <div className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
            {user.is_admin === 1 && (
              <div className="flex items-center mt-1">
                <AdminPanelSettingsIcon className="w-4 h-4 text-red-600 mr-1" />
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Administrador
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-2 pb-3">
        <div className="space-y-1">
          <div className="border-t border-gray-200 my-2"></div>
          <Button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogoutIcon className="w-5 h-5 mr-3" />
            <Text
              text={"Cerrar Sesión"}
              className="text-sm font-medium text-red-600"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileMobile;