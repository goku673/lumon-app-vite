"use client"
import { useState } from 'react';
import * as XLSX from 'xlsx';

/**
 * Hook para procesar datos de Excel y realizar operaciones por lotes
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.processRecord - Función para procesar cada registro
 * @param {Function} options.onProgress - Función para reportar progreso
 * @param {Function} options.onComplete - Función para notificar finalización
 * @param {Function} options.onError - Función para manejar errores
 * @param {Function} options.transformRecord - Función para transformar cada registro antes de procesarlo
 * @returns {Object} - Métodos y estado del procesador
 */
export const useExcelProcessor = ({
  processRecord,
  onProgress,
  onComplete,
  onError,
  transformRecord,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [processedRecords, setProcessedRecords] = useState(0);
  const [successList, setSuccessList] = useState([]);
  const [failedList, setFailedList] = useState([]);

  const processRecords = async (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      if (onError) onError(new Error("No hay registros para procesar"));
      return;
    }

    try {
      setIsProcessing(true);
      setSuccessList([]);
      setFailedList([]);
      setTotalRecords(records.length);
      setProcessedRecords(0);

      if (onProgress) onProgress({
        status: "Iniciando procesamiento",
        current: 0,
        total: records.length,
        percentage: 0
      });

      let localSuccessList = [];
      let localFailedList = [];

      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        let transformedRecord;
        
        if (onProgress) onProgress({
          status: `Procesando registro ${i+1} de ${records.length}`,
          current: i + 1,
          total: records.length,
          percentage: Math.round(((i + 1) / records.length) * 100)
        });

        try {

          transformedRecord = transformRecord ? transformRecord(record) : record;
          
          const result = await processRecord(transformedRecord);
          
          const successItem = {
            ...transformedRecord,
            ...result
          };
          localSuccessList.push(successItem);
          setSuccessList(prev => [...prev, successItem]);
          
        } catch (error) {
          let errorMessage = "Error desconocido";
          
          if (error.data?.message) {
            errorMessage = error.data.message;
          } else if (error.status) {
            switch(error.status) {
              case 400: errorMessage = "Datos inválidos"; break;
              case 401: errorMessage = "No autorizado"; break;
              case 409: errorMessage = "Registro duplicado"; break;
              case 500: errorMessage = "Error del servidor"; break;
              default: errorMessage = `Error (${error.status})`;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          const failedItem = {
            ...transformedRecord,
            error: errorMessage
          };
          localFailedList.push(failedItem);
          setFailedList(prev => [...prev, failedItem]);
        }
        
        setProcessedRecords(i + 1);
      }

      if (onComplete) onComplete({
        total: records.length,
        success: localSuccessList.length,
        failed: localFailedList.length,
        successList: localSuccessList,
        failedList: localFailedList
      });
      
    } catch (error) {
      if (onError) onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportResults = (fileName = "resultados") => {
    const workbook = XLSX.utils.book_new();
    
    if (successList.length > 0) {
      const allKeys = [...new Set(successList.flatMap(item => Object.keys(item)))];
      const filteredKeys = allKeys.filter(key => !key.startsWith('_') && key !== 'error');
      const headers = filteredKeys;
      const rows = successList.map(item => {
        return filteredKeys.map(key => item[key] || "");
      });
      
      const sheetData = [headers, ...rows];
      
      const successSheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, successSheet, "Registros Exitosos");
    }
    
    if (failedList.length > 0) {
      const allKeys = [...new Set(failedList.flatMap(item => Object.keys(item)))];
      const filteredKeys = allKeys.filter(key => !key.startsWith('_') && key !== 'error');
      const headers = [...filteredKeys, "error"];
    
      const rows = failedList.map(item => {
        return [...filteredKeys.map(key => item[key] || ""), item.error || ""];
      });
      
      const sheetData = [headers, ...rows];
      
      const failedSheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, failedSheet, "Registros Fallidos");
    }
    
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;
    XLSX.writeFile(workbook, `${fileName}_${formattedDate}.xlsx`);
  };

  return {
    processRecords,
    exportResults,
    isProcessing,
    totalRecords,
    processedRecords,
    successList,
    failedList,
    progress: totalRecords > 0 ? Math.round((processedRecords / totalRecords) * 100) : 0
  };
};

export default useExcelProcessor;