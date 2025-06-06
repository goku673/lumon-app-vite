export const ModalContainer = ({ children, className = "" }) => {
    return <div className={`bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden ${className}`}>{children}</div>
  }
  