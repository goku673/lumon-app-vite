const DetailSection = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200 ${className}`}>
      {title && <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  )
}

export default DetailSection;
