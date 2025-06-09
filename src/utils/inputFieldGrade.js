export const gradeFields = [
  {
    groupLabel: "Información del Grado",
    layout: "space-y-4",
    fields: [
      {
        name: "name",
        type: "text",
        placeholder: "Nombre del grado",
        required: true,
        icon: "CategoryIcon",
        label: "Nombre del Grado",
      },
      {
        name: "description",
        type: "textarea",
        placeholder: "Descripción breve del grado (máx. 10 palabras)",
        required: true,
        rows: 3,
        maxWords: 10,
        icon: "DescriptionIcon",
        label: "Descripción",
      },
      {
        name: "price",
        type: "number",
        placeholder: "Costo del grado",
        required: true,
        step: "0.01",
        icon: "PaidIcon",
        label: "Precio (Bs)",
      },
    ],
  },
]

// Corregir la función renderField para manejar handlers consistentemente
export const renderField = (fieldConfig, formData, handlers ) => {
  // Extraer handlers del objeto handlers
  const handleChange = handlers?.handleChange
  const handleDescriptionChange = handlers?.handleDescriptionChange

  switch (fieldConfig.type) {
    case "text":
    case "number":
      return {
        component: "Input",
        props: {
          type: fieldConfig.type,
          name: fieldConfig.name,
          value: formData[fieldConfig.name],
          onChange: handleChange,
          placeholder: fieldConfig.placeholder,
          required: fieldConfig.required,
          className:
            "w-full px-4 py-3 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
          step: fieldConfig.step,
        },
      }
    case "textarea":
      return {
        component: "Textarea",
        props: {
          name: fieldConfig.name,
          value: formData.description,
          onChange: handleDescriptionChange,
          className:
            "w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none",
          rows: fieldConfig.rows,
          placeholder: fieldConfig.placeholder,
        },
        wordCount: formData.wordCount,
        maxWords: fieldConfig.maxWords,
      }
    default:
      return null
  }
}
