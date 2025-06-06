import { useLocation, Link } from "react-router-dom";
import NavItem from "./navItem";
import LoginIcon from "@mui/icons-material/Login";

const NavLinks = ({ links, isMenuOpen, setIsMenuOpen, token }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <ul className={`flex items-center ${isMenuOpen ? "flex-col space-y-1" : "md:flex-row space-x-1"}`}>
      {links.map((link) => (
        <NavItem
          key={link.href}
          href={link.href}
          label={link.label}
          isActive={pathname === link.href}
        />
      ))}

      {isMenuOpen && !token && (
        <li
          className="transform transition-all duration-500 w-full mt-4"
          style={{
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? "translateX(0)" : "translateX(-50px)",
            transitionDelay: `${links.length * 100}ms`,
          }}
        >
          <Link
            to="/auth/signIn"
            className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            <LoginIcon className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </Link>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;