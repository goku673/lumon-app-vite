"use client"

import React from "react"
import Input from "../common/input"
import Select from "../common/select"
import Textarea from "../common/textarea"
import Selector from "./selector"
import CategoryIcon from "@mui/icons-material/Category"
import DescriptionIcon from "@mui/icons-material/Description"
import PaidIcon from "@mui/icons-material/Paid"

/**
 * Componente genérico para renderizar diferentes tipos de componentes de formulario
 * @param {Object} fieldConfig - Configuración del campo
 * @param {Object} formData - Datos del formulario
 * @param {Object} handlers - Manejadores de eventos
 * @param {Object} dataProviders - Proveedores de datos (opcional)
 * @returns {JSX.Element} - Componente renderizado
 */
const RenderComponent = ({ 
  fieldConfig, 
  formData, 
  handlers, 
  dataProviders = {},
  renderField
}) => {
 
  const { component, props, maxWords, message, } = renderField(
    fieldConfig, 
    formData, 
    handlers, 
    dataProviders
  );
  
  switch (component) {
    case "Input":
      return (
        <div className="flex items-center">
          {fieldConfig.icon === "CategoryIcon" && <CategoryIcon className="mr-2" fontSize="small" />}
          {fieldConfig.icon === "PaidIcon" && <PaidIcon className="mr-2" fontSize="small" />}
          <Input {...props} />
        </div>
      );
      
    case "Textarea":
      return (
        <Textarea
          label="Descripción"
          wordCount={formData.wordCount}
          maxWords={maxWords}
          showWordCount={true}
          showIcon={true}
          {...props}
        />
      );
      
    case "Select":
      return <Select {...props} />;
      
    case "Selector":
      return <Selector {...props} />;
      
    case "Loading":
      return <p className="text-gray-500">{message || "Cargando..."}</p>;
      
    case "Error":
      return <p className="text-red-500">{message || "Error al cargar datos"}</p>;
      
    default:
      return null;
  }
};

export default RenderComponent;