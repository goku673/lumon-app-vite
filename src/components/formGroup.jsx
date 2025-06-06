import Label from "../common/label";
const FormGroup = ({ label, children, error, className }) => (
    <div className={`mb-6 ${className}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
  
  export default FormGroup;