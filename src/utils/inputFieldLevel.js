export const levelFields = [
  {
    groupLabel: "Información del Nivel",
    layout: "space-y-4",
    fields: [
      {
        name: "name",
        type: "text",
        label: "Nombre del Nivel",
        placeholder: "Nombre del nivel",
        required: true,
        icon: "CategoryIcon",
        className:
          "w-full px-4 py-3 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
      },
      {
        name: "description",
        type: "textarea",
        label: "Descripción",
        placeholder: "Descripción breve del nivel (máx. 10 palabras)",
        required: true,
        icon: "DescriptionIcon",
        maxWords: 10,
        rows: 3,
        className:
          "w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none",
      },
    ],
  },
]

// Corregir la función renderField para manejar handlers consistentemente
export const renderField = (fieldConfig, formData, handlers) => {
  // Extraer handlers del objeto handlers
  const handleChange = handlers?.handleChange
  const handleDescriptionChange = handlers?.handleDescriptionChange

  switch (fieldConfig.type) {
    case "text":
      return {
        component: "Input",
        props: {
          type: fieldConfig.type,
          name: fieldConfig.name,
          value: formData[fieldConfig.name],
          onChange: handleChange,
          placeholder: fieldConfig.placeholder,
          required: fieldConfig.required,
          className: fieldConfig.className,
        },
      }
    case "textarea":
      return {
        component: "Textarea",
        props: {
          name: fieldConfig.name,
          value: formData[fieldConfig.name],
          onChange: handleDescriptionChange,
          placeholder: fieldConfig.placeholder,
          required: fieldConfig.required,
          className: fieldConfig.className,
          rows: fieldConfig.rows,
        },
        wordCount: formData.wordCount,
        maxWords: fieldConfig.maxWords,
      }
    default:
      return { component: null, props: {} }
  }
}
