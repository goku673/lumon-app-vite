
const DetailField = ({ label, value }) => (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input type="text" className="w-full px-3 py-2 bg-white border rounded-md" value={value} readOnly />
    </div>
  )

export default DetailField;