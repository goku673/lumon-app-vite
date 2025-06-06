
const DetailSection = ({ title, children, className = "" }) => {
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-medium text-white text-center mb-4 ${className}`}>
        {title}
      </h2>
      <div className="bg-white rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};

export default DetailSection