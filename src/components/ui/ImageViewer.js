"use client";

import { useState } from 'react';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@/common/button';

const ImageViewer = ({ 
  src, 
  alt, 
  className = '', 
  height = 'h-48', 
  showHoverEffect = true,
  hoverText = 'Ver imagen'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div 
        className={`${height} relative rounded-lg overflow-hidden cursor-pointer ${className}`}
        onClick={openModal}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "cover" }}
          className="hover:scale-105 transition-transform duration-300"
        />
        {showHoverEffect && (
          <div className="absolute inset-0 bg-transparent hover:bg-black hover:bg-opacity-20 flex items-center justify-center transition-all duration-300">
            <span className="text-white opacity-0 hover:opacity-100 font-medium">{hoverText}</span>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full h-auto max-h-[90vh]">
            <Button 
              onClick={closeModal}
              className="absolute -top-12 right-0 bg-white text-[#0f2e5a] rounded-full p-2 shadow-lg hover:bg-gray-200"
              aria-label="Cerrar imagen"
            >
              <CloseIcon />
            </Button>
            
            <div className="relative w-full h-[80vh]">
              <Image
                src={src}
                alt={alt}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageViewer;