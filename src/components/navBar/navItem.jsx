import { Link } from "react-router-dom";

const NavItem = ({ href, label, isActive, children }) => {
  return (
    <li className="relative">
      <Link
        to={href}
        className={`block py-2 px-2 transition-all duration-75 hover:text-primary-600 ${
          isActive
            ? "text-primary-700 font-medium border-b-[3px] border-gray-500 shadow-navItem"
            : "text-gray-700 border-b-4 border-transparent"
        }`}
      >
        {label}
      </Link>
      {children}
    </li>
  );
};

export default NavItem;