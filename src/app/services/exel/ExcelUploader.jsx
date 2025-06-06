
import { useState, useRef } from 'react';
import Button from '../../../common/button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx';

/**
 * Componente para cargar y procesar archivos Excel
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onFileProcessed - Función que se ejecuta cuando se procesa un archivo
 * @param {Function} props.onDownloadTemplate - Función para personalizar la plantilla (opcional)
 * @param {Array} props.templateHeaders - Encabezados para la plantilla
 * @param {Array} props.templateExample - Ejemplo para la plantilla
 * @param {String} props.templateName - Nombre de la plantilla
 * @param {String} props.uploadButtonText - Texto del botón de carga
 * @param {String} props.downloadButtonText - Texto del botón de descarga
 * @param {String} props.className - Clases adicionales
 */
const ExcelUploader = ({
  onFileProcessed,
  onDownloadTemplate,
  templateHeaders = [],
  templateExample = [],
  templateName = "plantilla",
  uploadButtonText = "Cargar Archivo Excel",
  downloadButtonText = "Descargar Plantilla",
  className = "",
}) => {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processExcelFile = async (file) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          if (onFileProcessed && typeof onFileProcessed === 'function') {
            onFileProcessed(jsonData);
          }
          
        } catch (error) {
          console.error("Error procesando archivo:", error);
          throw new Error("Error al procesar el archivo Excel. Verifique el formato.");
        }
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error("Error leyendo archivo:", error);
      throw new Error("No se pudo leer el archivo seleccionado.");
    }
  };

  const downloadTemplate = () => {
    if (onDownloadTemplate && typeof onDownloadTemplate === 'function') {
      onDownloadTemplate();
      return;
    }
    
    const templateData = [
      templateHeaders,
      templateExample
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    
    XLSX.writeFile(wb, `${templateName}.xlsx`);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessing(true);
      processExcelFile(file)
        .catch(error => {
          console.error("Error en el procesamiento:", error);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={downloadTemplate}
          className="bg-[#0f2e5a] hover:bg-[#0d3772] text-white font-bold py-2 px-4 rounded-md flex items-center"
          disabled={isProcessing}
        >
          <DownloadIcon className="mr-2" />
          {downloadButtonText}
        </Button>
        
        <Button
          onClick={handleUploadClick}
          className="bg-[#00A86B] hover:bg-[#008f5b]  text-white font-bold py-2 px-4 rounded-md flex items-center"
          disabled={isProcessing}
        >
          <UploadFileIcon className="mr-2" />
          {uploadButtonText}
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx, .xls"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ExcelUploader;