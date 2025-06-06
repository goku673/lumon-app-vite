import { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Button from "../../common/button";

const VideoHelp = ({ 
  videoId = "_BmU-HChO5Y",
  autoOpen = true,
  title = "Tutorial de Ayuda",
  description = "Mira este video tutorial para aprender a usar nuestra plataforma."
}) => {
  const [isOpen, setIsOpen] = useState(false);

  
  useEffect(() => {
    if (autoOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={handleOpen}
            className="bg-[#0f2e5a] hover:bg-[#1a4b8f] text-white rounded-full p-3 shadow-lg"
            aria-label="Abrir tutorial de ayuda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-[#0f2e5a]">{title}</h2>
              <Button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cerrar tutorial"
              >
                <CloseIcon />
              </Button>
            </div>
            
            <div className="p-4">
              <p className="mb-4 text-gray-700">{description}</p>
              
              <div className="relative pb-[56.25%] h-0 overflow-hidden">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <Button 
                onClick={handleClose}
                className="bg-[#0f2e5a] hover:bg-[#1a4b8f] text-white px-4 py-2 rounded"
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoHelp;