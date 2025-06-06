const NameFields = ({ title, firstName, middleName, lastName }) => (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium">{title}</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" className="w-full px-3 py-2 bg-white border rounded-md" value={lastName} readOnly />
        <input type="text" className="w-full px-3 py-2 bg-white border rounded-md" value={middleName} readOnly />
        <input type="text" className="w-full px-3 py-2 bg-white border rounded-md" value={firstName} readOnly />
      </div>
    </div>
  )

  export default NameFields;