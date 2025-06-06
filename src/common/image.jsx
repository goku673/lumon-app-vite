import React, { useState } from "react";

const Image = ({
  src,
  alt = "",
  fallback = "https://via.placeholder.com/200?text=Imagen+no+disponible",
  className = "",
  style = {},
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallback);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
};

export default Image;