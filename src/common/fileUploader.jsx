import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import Text from "./text";
const FileUploader = ({
  name,
  onChange,
  accept,
  className,
  label = "Arrastra y suelta un archivo aquí, o haz clic para seleccionar",
}) => {
  return (
    <label
      htmlFor={name}
      className={`flex flex-col items-center justify-center w-full h-32 p-4 cursor-pointer ${className}`}
    >
      <CloudUploadIcon className="text-gray-400 mb-2" style={{ fontSize: 40 }} />
      <Text text={label} className="text-sm text-gray-500 text-center" />
      <input id={name} name={name} type="file" className="hidden" onChange={onChange} accept={accept} />
    </label>
  )
}

export default FileUploader;
