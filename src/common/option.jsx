const Option = ({ value, label, className, ...props }) => (
  <option className={className} value={value} {...props}>
    {label}
  </option>
);
  
export default Option;



  