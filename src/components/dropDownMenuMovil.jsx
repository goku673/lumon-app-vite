import React from "react";

const DropDownMenuMovil = ({ children, isMenuOpen, className }) => {
  return (
    <div className={`bg-white ${className}`}>
      <div className="space-y-1 p-4">
        {children}
      </div>
      <div
        className="border-t border-gray-200 pt-2 pb-4 px-4"
        style={{
          opacity: isMenuOpen ? 1 : 0,
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease',
          transitionDelay: '500ms',
        }}
      >
      </div>
    </div>
  );
};

export default DropDownMenuMovil;