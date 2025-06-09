import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import NavLinks from "./navBar/navLink";
import { navLinks } from "../utils/utilsNavLinks";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import DropDownMenuMovil from "./dropDownMenuMovil";
import Button from "../common/button";
import { useGetUserQuery } from "../app/redux/services/authApi";
import UserProfileMobile from "./userProfileMovil";
import UserProfile from "./userProfile";
import UserLoadingSkeleton from "../common/userLoading";

const TopMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);


  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(token, {
    skip: !token,
  });

  const filteredLinks = useMemo(() => {
    if (!user) return [];
    if (user.is_admin) return navLinks;
    return navLinks.filter(link => !link.adminOnly);
  }, [user]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/auth/signIn";
  };

  return (
    <header className="bg-white shadow relative z-50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-20 lg:h-20 md:h-20 sm:h-8">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="SanSi Logo" 
                width={120} 
                height={60} 
                className="h-12 w-auto md:h-12 sm:h-5" 
              />
            </Link>
          </div>

          <nav className="hidden lg:flex flex-grow justify-center">
            <NavLinks
              links={filteredLinks}
              className="space-x-1"
              user={user}
              token={token}
              isMenuOpen={false}
              setIsMenuOpen={setIsMenuOpen}
            />
          </nav>

          <div className="hidden lg:flex">
            {token && user && !isLoadingUser ? (
              <UserProfile user={user} onLogout={handleLogout} />
            ) : isLoadingUser ? (
              <UserLoadingSkeleton className="" />
            ) : (
              <Link
                to="/auth/signIn"
                className="ml-4 inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          <div className="lg:hidden">
            <Button
              type="button"
              className="inline-flex items-center justify-center p-0 md:p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-500 transition-all duration-300"
              onClick={toggleMenu}
              style={{
                transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            >
              {isMenuOpen ? (
                <CloseIcon className="block h-4 w-4 md:h-5 md:w-5 sm:h-3 sm:w-3" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-4 w-4 md:h-5 md:w-5 sm:h-3 sm:w-3" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:hidden perspective-[1200px] origin-top w-full overflow-hidden">
        <DropDownMenuMovil
          isMenuOpen={isMenuOpen}
          className={`transform transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
            isMenuOpen
              ? "opacity-100 rotate-x-0 shadow-2xl max-h-[600px]"
              : "opacity-0 -rotate-x-90 shadow-none pointer-events-none max-h-0"
          }`}
        >
          <NavLinks
            links={filteredLinks}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            className="flex-col space-y-1"
            user={user}
            token={token}
          />
          {token && user && !isLoadingUser && (
            <UserProfileMobile user={user} onLogout={handleLogout} setIsMenuOpen={setIsMenuOpen} />
          )}
          {token && isLoadingUser && (<UserLoadingSkeleton />)}
        </DropDownMenuMovil>
      </div>
    </header>
  );
};

export default TopMenu;