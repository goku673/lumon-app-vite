
import { useRef } from "react";
import Button from "../../common/button";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ComunicadoCard from "./ComunicadoCard";

const ComunicadosCarousel = ({ comunicados = [], isLoading = false }) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-white p-8">
        Cargando comunicados...
      </div>
    );
  }

  if (comunicados.length === 0) {
    return (
      <div className="text-center text-white p-8">
        No hay comunicados disponibles en este momento.
      </div>
    );
  }

  return (
    <div className="relative px-4 lg:px-12">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <Button 
          onClick={scrollLeft} 
          className="bg-[#0f2e5a] hover:bg-[#1a4b8f] text-white rounded-full p-2 shadow-lg"
          aria-label="Desplazar a la izquierda"
        >
          <ArrowBackIosIcon />
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <Button 
          onClick={scrollRight} 
          className="bg-[#0f2e5a] hover:bg-[#1a4b8f] text-white rounded-full p-2 shadow-lg"
          aria-label="Desplazar a la derecha"
        >
          <ArrowForwardIosIcon />
        </Button>
      </div>
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto pb-8 pt-4 px-8 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {comunicados.map((comunicado, index) => (
          <div key={index} className="flex-shrink-0 w-full md:w-[500px] px-4 snap-start">
            <ComunicadoCard comunicado={comunicado} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComunicadosCarousel;