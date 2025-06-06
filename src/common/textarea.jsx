import React from "react"
import DescriptionIcon from "@mui/icons-material/Description"

const Textarea = ({ 
  className, 
  onChange, 
  wordCount = 0, 
  maxWords = 100, 
  showWordCount = false,
  showIcon = false,
  ...props 
}) => {
  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      onChange(e);
    } else if (onChange && typeof onChange.handleDescriptionChange === 'function') {
      onChange.handleDescriptionChange(e);
    } else if (onChange && typeof onChange.handleChange === 'function') {
      onChange.handleChange(e);
    }
  };

  const isOverLimit = maxWords > 0 && wordCount > maxWords;

  return (
    <div className="w-full">
      <div className="relative">
        {showIcon && (
          <div className="absolute top-3 left-3 text-gray-400">
            <DescriptionIcon />
          </div>
        )}
        <textarea
          className={`w-full px-4 py-2 ${showIcon ? 'pl-10' : ''} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${isOverLimit ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          onChange={handleChange}
          {...props}
        />
      </div>
      {showWordCount && (
        <div className={`text-sm mt-1 text-right ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
          {wordCount} / {maxWords} palabras
        </div>
      )}
    </div>
  );
};

export default Textarea;