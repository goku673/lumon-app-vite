
import { useState } from 'react';
import ExcelUploader from './ExcelUploader';
import Modal from '../../../components/modal/modal';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '../../../common/button';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Componente de UI para procesamiento por lotes con Excel
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onProcessRecords - Función para procesar registros
 * @param {Function} props.onExportResults - Función para exportar resultados
 * @param {Array} props.templateHeaders - Encabezados para la plantilla
 * @param {Array} props.templateExample - Ejemplo para la plantilla
 * @param {String} props.title - Título del componente
 * @param {String} props.className - Clases adicionales
 */
const BatchProcessingUI = ({
  onProcessRecords,
  onExportResults,
  templateHeaders = [],
  templateExample = [],
  title = "Procesamiento por Lotes",
  className = "",
  processor = null
}) => {
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const [loadingModal, setLoadingModal] = useState({ isOpen: false, title: "Procesando", message: "Procesando registros..." });
  
  const handleFileProcessed = (data) => {
    if (!data || data.length === 0) {
      setModal({
        isOpen: true,
        title: "Archivo vacío",
        message: "El archivo no contiene registros para procesar.",
        type: "warning"
      });
      return;
    }
    
    setLoadingModal(prev => ({ 
      ...prev, 
      isOpen: true, 
      message: `Procesando 0 de ${data.length} registros...` 
    }));
    
    if (onProcessRecords && typeof onProcessRecords === 'function') {
      onProcessRecords(data, {
        onProgress: (progress) => {
          setLoadingModal(prev => ({ 
            ...prev, 
            message: `Procesando ${progress.current} de ${progress.total} registros (${progress.percentage}%)...` 
          }));
        },
        onComplete: (result) => {
          setLoadingModal(prev => ({ ...prev, isOpen: false }));
          setModal({
            isOpen: true,
            title: "Procesamiento completado",
            message: `Se procesaron ${result.total} registros. ${result.success} exitosos, ${result.failed} fallidos.`,
            type: result.success > 0 ? "success" : "warning"
          });
        },
        onError: (error) => {
          setLoadingModal(prev => ({ ...prev, isOpen: false }));
          setModal({
            isOpen: true,
            title: "Error en el procesamiento",
            message: error.message || "Ocurrió un error durante el procesamiento.",
            type: "error"
          });
        }
      });
    }
  };
  
  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };
  
  const handleExportResults = () => {
    if (onExportResults && typeof onExportResults === 'function') {
      onExportResults();
    }
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      
      <ExcelUploader
        onFileProcessed={handleFileProcessed}
        templateHeaders={templateHeaders}
        templateExample={templateExample}
        templateName="plantilla_registros"
      />
      
      {processor && processor.isProcessing && (
        <div className="mt-4 p-2 bg-gray-700 rounded text-white">
          <p>{`Procesando ${processor.processedRecords} de ${processor.totalRecords} registros...`}</p>
          <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
            <div 
              className="bg-[#00A86B] hover:bg-[#008f5b] text-white h-2.5 rounded-full" 
              style={{ width: `${processor.progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {processor && processor.processedRecords > 0 && !processor.isProcessing && (
        <div className="mt-4">
          <Button
            onClick={handleExportResults}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
          >
            <DownloadIcon className="mr-2" />
            Exportar Resultados
          </Button>
        </div>
      )}
      
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        iconType={modal.type}
        primaryButtonText="Ok"
        onPrimaryClick={closeModal}
      >
        <p>{modal.message}</p>
        
        {processor && (processor.successList.length > 0 || processor.failedList.length > 0) && (
          <div className="mt-4">
            {processor.successList.length > 0 && (
              <div className="mb-2">
                <p className="font-bold text-green-500">Registros exitosos ({processor.successList.length}):</p>
                <ul className="max-h-40 overflow-y-auto">
                  {processor.successList.map((item, index) => (
                    <li key={`success-${index}`} className="text-sm">
                      {item.name || item.nombre} {item.last_name || item.apellido} - {item.ci || item.cedula}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {processor.failedList.length > 0 && (
              <div>
                <p className="font-bold text-red-500">Registros fallidos ({processor.failedList.length}):</p>
                <ul className="max-h-40 overflow-y-auto">
                  {processor.failedList.map((item, index) => (
                    <li key={`failed-${index}`} className="text-sm">
                      {item.name || item.nombre} {item.last_name || item.apellido} - {item.ci || item.cedula}: {item.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
      
      <Modal
        isOpen={loadingModal.isOpen}
        title={loadingModal.title}
        showCloseButton={false}
        showButtons={false}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <CircularProgress color="error" className="mb-4" />
          <p>{loadingModal.message}</p>
        </div>
      </Modal>
    </div>
  );
};

export default BatchProcessingUI;