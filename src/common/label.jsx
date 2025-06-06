const Label = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`block text-gray-700 mb-2 ${className}`}>
      {children}
    </label>
  );
  
  export default Label;