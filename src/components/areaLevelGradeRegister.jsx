import { useState, useRef } from "react";
import * as XLSX from 'xlsx';

import { usePostAreaLevelsGradesMutation } from "../app/redux/services/areaLevelsGrades";
import Button from "../common/button";
import Selector from "./selector";
import Modal from "./modal/modal";
import { useGetAreasQuery } from "../app/redux/services/areaApi";
import { useGetLevelsQuery } from "../app/redux/services/levelsApi";
import { useGetGradesQuery } from "../app/redux/services/gradesApi";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from '@mui/material/CircularProgress';
import useExcelProcessor from "../app/services/exel/ExcelProcessor";
import BatchProcessingUI from "../app/services/exel/BatchProcessingUI";

const RegisterAreaLevelGradeComponent = () => {
  const [createAssociation] = usePostAreaLevelsGradesMutation();
  const { data: areas } = useGetAreasQuery();
  const { data: levels } = useGetLevelsQuery();
  const { data: grades } = useGetGradesQuery();
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [loadingModal, setLoadingModal] = useState({ isOpen: false, message: "Procesando registros..." });
  const processingRef = useRef(false);
  const templateHeaders = ["area_id", "level_id", "grade_ids"];
  const templateExample = [1, 2, "3,4,5"];

  const excelProcessor = useExcelProcessor({
    processRecord: async (record) => {
      if (!record.area_id || !record.level_id || !record.grade_ids) {
        throw new Error("Datos incompletos en el registro");
      }
      
      let gradeIds = record.grade_ids;
      if (typeof gradeIds === 'string') {
        gradeIds = gradeIds.split(',').map(id => parseInt(id.trim()));
      } else if (typeof gradeIds === 'number') {
        gradeIds = [gradeIds];
      }
      
      const response = await createAssociation({
        area_id: parseInt(record.area_id),
        level_id: parseInt(record.level_id),
        grade_ids: gradeIds
      }).unwrap();
    
      return {
        ...response,
        area_name: areas?.find(a => a.id === parseInt(record.area_id))?.name || "Desconocido",
        level_name: levels?.find(l => l.id === parseInt(record.level_id))?.name || "Desconocido"
      };
    },
    onProgress: ({ current, total }) => {
      if (processingRef.current) {
        setLoadingModal({
          isOpen: true,
          message: `Procesando ${current} de ${total} registros...`
        });
      }
    },
    onComplete: ({ success, failed }) => {
      processingRef.current = false;
      
      setTimeout(() => {
        setLoadingModal({ isOpen: false, message: "" });
        setModalType(success > 0 ? "success" : "warning");
        setModalMessage(`Procesamiento completado. ${success} exitosos, ${failed} fallidos.`);
        setIsModalOpen(true);
      }, 500);
    },
    onError: (error) => {
      processingRef.current = false;
      
      setTimeout(() => {
        setLoadingModal({ isOpen: false, message: "" });
        setModalType("error");
        setModalMessage(error.message || "Error en el procesamiento");
        setIsModalOpen(true);
      }, 500);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedArea || !selectedLevel || selectedGrades.length === 0) {
      setModalType("error");
      setModalMessage("Debe seleccionar todas las opciones requeridas");
      setIsModalOpen(true);
      return;
    }

    try {
      await createAssociation({
        area_id: selectedArea.id,
        level_id: selectedLevel.id,
        grade_ids: selectedGrades.map(grade => grade.id)
      }).unwrap();
      setModalType("success");
      setModalMessage("Asociación creada exitosamente!");
      setIsModalOpen(true);
      setSelectedArea(null);
      setSelectedLevel(null);
      setSelectedGrades([]);
      
    } catch (error) {
      console.error("Error creating association:", error);
      setModalType("error");
      setModalMessage(error.data?.message || "Error al crear la asociación");
      setIsModalOpen(true);
    }
  };

  const handleProcessRecords = (records) => {
    // Limpiar listas anteriores antes de procesar nuevos registros
    excelProcessor.clearResults?.() || [];
    
    // Establecer el estado de procesamiento
    processingRef.current = true;
    setLoadingModal({ 
      isOpen: true, 
      message: `Procesando 0 de ${records.length} registros...` 
    });
    
    // Iniciar el procesamiento
    excelProcessor.processRecords(records);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Asociar Área con Nivel y Grados</h2>
      <BatchProcessingUI
        title="Carga Masiva por Excel"
        onProcessRecords={handleProcessRecords}
        onExportResults={() => excelProcessor.exportResults("resultados_area_level_grade")}
        templateHeaders={templateHeaders}
        templateExample={templateExample}
        processor={excelProcessor}
        className="mb-8"
      />
      
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Registro Manual</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccione un Área
            </label>
            <Selector
              items={areas || []}
              selectedItems={selectedArea ? [selectedArea] : []}
              onSelect={(item) => setSelectedArea(item)}
              onRemove={() => setSelectedArea(null)}
              placeholder="Buscar área..."
              isMultiSelect={false}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccione un Nivel
            </label>
            <Selector
              items={levels || []}
              selectedItems={selectedLevel ? [selectedLevel] : []}
              onSelect={(item) => setSelectedLevel(item)}
              onRemove={() => setSelectedLevel(null)}
              placeholder="Buscar nivel..."
              isMultiSelect={false}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccione Grados
          </label>
          <Selector
            items={grades || []}
            selectedItems={selectedGrades}
            onSelect={(item) => setSelectedGrades(prev => [...prev, item])}
            onRemove={(item) => setSelectedGrades(prev => prev.filter(g => g.id !== item.id))}
            placeholder="Buscar grados..."
            isMultiSelect={true}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#0f2e5a] hover:bg-white border-[#0f2e5a] border-2 hover:text-[#0f2e5a] text-white px-6 py-2 rounded-md transition-colors"
          > 
            <SaveIcon className="mr-2" fontSize="small" />
            Crear Asociación
          </Button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "success" ? "Éxito" : "Error"}
        iconType={modalType}
        primaryButtonText="Aceptar"
        onPrimaryClick={() => setIsModalOpen(false)}
      >
        <p className="text-gray-700">{modalMessage}</p>
        
        {(excelProcessor.successList.length > 0 || excelProcessor.failedList.length > 0) && (
          <div className="mt-4">
            {excelProcessor.successList.length > 0 && (
              <div className="mb-2">
                <p className="font-bold text-green-500">Registros exitosos ({excelProcessor.successList.length}):</p>
                <ul className="max-h-40 overflow-y-auto">
                  {excelProcessor.successList.map((item, index) => (
                    <li key={`success-${index}`} className="text-sm">
                      Área: {item.area_name} - Nivel: {item.level_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {excelProcessor.failedList.length > 0 && (
              <div>
                <p className="font-bold text-red-500">Registros fallidos ({excelProcessor.failedList.length}):</p>
                <ul className="max-h-40 overflow-y-auto">
                  {excelProcessor.failedList.map((item, index) => (
                    <li key={`failed-${index}`} className="text-sm">
                      Área: {item.area_id} - Nivel: {item.level_id} - Error: {item.error}
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
        title="Procesando"
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

export default RegisterAreaLevelGradeComponent;