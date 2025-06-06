const FormContainer = ({ children, className }) => {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 mb-6 ${className}`}>
        {children}
      </div>
    );
  };
  
  export default FormContainer;