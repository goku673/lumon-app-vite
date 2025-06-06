import QuestionMarkIcon from "@mui/icons-material/QuestionMark"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import InfoIcon from "@mui/icons-material/Info"
import WarningIcon from "@mui/icons-material/Warning"
import ErrorIcon from "@mui/icons-material/Error"
import CloseIcon from "@mui/icons-material/Close"

export const ModalHeader = ({ title, iconType, onClose, className = "" }) => {
  
  const renderIcon = () => {
    switch (iconType) {
      case "success":
        return <CheckCircleIcon className="text-green-500" style={{ fontSize: 24 }} />
      case "info":
        return <InfoIcon className="text-blue-500" style={{ fontSize: 24 }} />
      case "warning":
        return <WarningIcon className="text-amber-500" style={{ fontSize: 24 }} />
      case "question":
        return <QuestionMarkIcon className="text-blue-500" style={{ fontSize: 24 }} />
      case "error":
        return <ErrorIcon className="text-red-500" style={{ fontSize: 24 }} />
      default:
        return <QuestionMarkIcon className="text-blue-500" style={{ fontSize: 24 }} />
    }
  }

  return (
    <div className={`flex items-center p-4 gap-3 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 flex-shrink-0">
        {renderIcon()}
      </div>
      <h2 className="m-0 text-lg font-semibold text-blue-900 flex-1">{title}</h2>
      <button
        onClick={onClose}
        className="bg-transparent border-none cursor-pointer p-1 hover:bg-gray-100 rounded-full"
        aria-label="Cerrar"
      >
        <CloseIcon style={{ fontSize: 20 }} className="text-gray-500" />
      </button>
    </div>
  )
}
