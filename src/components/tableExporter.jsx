import { useState } from 'react';
import Button from '../common/button';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

/**
 * Componente para exportar datos de tablas a Excel
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos a exportar
 * @param {Array} props.columns - Definición de columnas (opcional)
 * @param {Function} props.transformData - Función para transformar datos antes de exportar (opcional)
 * @param {String} props.fileName - Nombre base del archivo (opcional)
 * @param {String} props.sheetName - Nombre de la hoja de Excel (opcional)
 * @param {String} props.buttonText - Texto del botón (opcional)
 * @param {String} props.className - Clases adicionales para el botón (opcional)
 */
const TableExporter = ({
  data = [],
  columns = [],
  transformData = null,
  fileName = "exportacion",
  sheetName = "Datos",
  buttonText = "Exportar a Excel",
  className = "bg-[#00A86B] hover:bg-[#008f5b] text-white font-bold py-2 px-4 rounded-md flex items-center",
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = () => {
    try {
      setIsExporting(true);
      if (!data || data.length === 0) {
        console.warn("No hay datos para exportar");
        return;
      }
      
      let dataToExport;
      
      if (transformData && typeof transformData === 'function') {
        dataToExport = transformData(data);
      } else if (columns && columns.length > 0) {
        dataToExport = data.map(item => {
          const row = {};
          columns.forEach(column => {
            if (column.accessorKey && column.id !== 'actions') {
              const columnName = column.header || column.accessorKey;
              let value = item[column.accessorKey];
              
              if (column.cell && typeof column.cell === 'function') {
                try {
                  const cellResult = column.cell({ getValue: () => value });
    
                  if (cellResult && typeof cellResult === 'object' && cellResult.props) {
                    if (typeof cellResult.props.children === 'string') {
                      value = cellResult.props.children;
                    }
                  }
                } catch (error) {
                  console.warn(`Error al procesar celda para ${column.accessorKey}:`, error);
                }
              }
              
              row[columnName] = value;
            }
          });
          return row;
        });
      } else {
        dataToExport = data;
      }
      
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      
      const columnWidths = [];
      for (const key in dataToExport[0]) {
        let maxWidth = key.length;
        dataToExport.forEach(row => {
          const cellValue = row[key] ? String(row[key]) : '';
          maxWidth = Math.max(maxWidth, cellValue.length);
        });
        columnWidths.push({ wch: Math.min(maxWidth + 2, 50) });
      }
      worksheet['!cols'] = columnWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      const date = new Date();
      const formattedDate = format(date, 'yyyy-MM-dd_HH-mm');
      const fullFileName = `${fileName}_${formattedDate}.xlsx`;
      XLSX.writeFile(workbook, fullFileName);
      
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToExcel}
      className={className}
      disabled={isExporting || data.length === 0}
    >
      <DownloadIcon className="mr-2" />
      {isExporting ? "Exportando..." : buttonText}
    </Button>
  );
};

export default TableExporter;