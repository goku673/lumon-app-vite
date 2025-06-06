
 const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

export default Card;