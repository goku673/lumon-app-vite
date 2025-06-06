import Option from "./option";

const Select = ({ className, options = [], value, onChange, ...props }) => (
  <select
    className={`bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 hover:text-black ${className}`}
    value={value}
    onChange={onChange}
    {...props}
  >
    {options.map((option, index) => (
      <Option key={index} value={option.value} label={option.label} className="" />
    ))}
  </select>
);

export default Select;