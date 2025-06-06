import React from "react";

    const Button = ({className, children, ...props}) => (
            <button 
              className={className} 
              {...props}
            >
             {children}
            </button>
    );

    export default Button;