const FormContent = ({ onSubmit, children, className }) => {
    return (
      <form onSubmit={onSubmit} className={className}>
        {children}
      </form>
    );
  };
  
  export default FormContent;