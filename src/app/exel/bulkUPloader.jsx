import React, { useRef, useState } from "react";
import Button from "../../common/button";
import * as XLSX from "xlsx";
import Input from "../../common/input";
import Modal from "../../components/modal/modal";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * BulkUploader 
 */
const BulkUploader = ({
  onUpload, 
  templateHeaders,
  templateExample,
  templateFileName = "plantilla.xlsx",
  uploadLabel = "Subir Archivo Excel",
  downloadLabel = "Descargar Plantilla",
  title = "Carga Masiva",
  className = "",
  processor = null, 
  onExportResults 
}) => {
  const fileInputRef = useRef(null);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const [loadingModal, setLoadingModal] = useState({ isOpen: false, title: "Procesando", message: "Procesando registros..." });

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([templateHeaders, templateExample]);
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, templateFileName);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingModal({ ...loadingModal, isOpen: true, message: "Procesando archivo..." });
    try {
      await onUpload(file);
      setModal({ isOpen: true, title: "Éxito", message: "Carga masiva exitosa.", type: "success" });
    } catch (err) {
      setModal({ isOpen: true, title: "Error", message: err?.data?.message || "Error al cargar archivo.", type: "error" });
    }
    setLoadingModal({ ...loadingModal, isOpen: false });
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleExportResults = () => {
    if (onExportResults && typeof onExportResults === "function") {
      onExportResults();
    }
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

      <div className="flex gap-4 mb-4">
        <Button 
        onClick={handleDownloadTemplate} 
        className="bg-[#0f2e5a] hover:bg-[#0d3772] text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          {downloadLabel}
        </Button>
        <Button 
        onClick={() => fileInputRef.current.click()} 
         className="bg-[#00A86B] hover:bg-[#008f5b] text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          {uploadLabel}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

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
        {processor && (processor.successList?.length > 0 || processor.failedList?.length > 0) && (
          <div className="mt-4">
            {processor.successList?.length > 0 && (
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
            {processor.failedList?.length > 0 && (
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

export default BulkUploader;