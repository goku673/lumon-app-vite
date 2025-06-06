import Button from "../../common/button"

export const ModalFooter = ({
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  className = "",
}) => {
  return (
    <div className={`flex justify-end p-4 gap-3 ${className}`}>
      {secondaryButtonText && (
        <Button
          className="bg-[#0f2e5a] text-white border-none rounded px-4 py-2 font-medium cursor-pointer min-w-[100px]"
          onClick={onSecondaryClick}
        >
          {secondaryButtonText}
        </Button>
      )}
      {primaryButtonText && (
        <Button
          className="bg-white text-blue-900 border border-blue-900 rounded px-4 py-2 font-medium cursor-pointer min-w-[100px]"
          onClick={onPrimaryClick}
        >
          {primaryButtonText}
        </Button>
      )}
    </div>
  )
}
