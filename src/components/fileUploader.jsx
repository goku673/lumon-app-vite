import UploadFileIcon from "@mui/icons-material/UploadFile";

const FileUploader = ({ name, onChange, accept, label, className }) => (
    <div className={`p-4 border border-dashed border-gray-300 rounded-md bg-gray-100 ${className}`}>
      <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center">
        <UploadFileIcon className="mr-2" />
        {label}
        <input
          type="file"
          name={name}
          className="hidden"
          onChange={onChange}
          accept={accept}
        />
      </label>
      <p className="text-sm text-gray-500">Formatos aceptados: {accept}</p>
    </div>
  );
  
  export default FileUploader;