const Input = ({ 
  className, 
  onChange, 
  ...props 
}) => {
  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      onChange(e);
    } else if (onChange && typeof onChange.handleChange === 'function') {
      onChange.handleChange(e);
    }
  };

  return (
    <input
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${className}`}
      onChange={handleChange}
      {...props}
    />
  );
};

export default Input;

