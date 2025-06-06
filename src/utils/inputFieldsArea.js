

export const areaFields = [
  {
    groupLabel: "Información del Área",
    layout: "space-y-6",
    fields: [
      {
        name: "name",
        label: "Nombre del Área",
        type: "input",
        placeholder: "Ingresa el nombre del área",
        required: true,
        className: "w-full px-4 py-3 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
        icon: "CategoryIcon"
      },
      {
        name: "description",
        label: "Descripción",
        type: "textarea",
        placeholder: "Descripción breve del área (máx. 10 palabras)",
        required: true,
        maxWords: 10,
        rows: 3,
        className: "w-full px-4 py-3 border-2 rounded-md focus:ring-2 focus:ring-red-600 transition-all resize-none",
        icon: "DescriptionIcon"
      }
    ]
  }
];


export const renderField = (fieldConfig, formData, handlers) => {
  const { type, name } = fieldConfig;
  
  const handleChange = typeof handlers === 'function' ? handlers : handlers?.handleChange;
  const handleDescriptionChange = typeof handlers === 'function' ? handlers : handlers?.handleDescriptionChange;
  
  switch (type) {
    case "input":
      return {
        component: "Input",
        props: {
          type: "text",
          name: name,
          value: formData[name],
          onChange: handleChange,
          placeholder: fieldConfig.placeholder,
          required: fieldConfig.required,
          className: fieldConfig.className
        }
      };
    case "textarea":
      return {
        component: "Textarea",
        props: {
          name: name,
          value: formData[name],
          onChange: handleDescriptionChange,
          placeholder: fieldConfig.placeholder,
          rows: fieldConfig.rows,
          className: fieldConfig.className
        },
        wordCount: formData.wordCount,
        maxWords: fieldConfig.maxWords
      };
    default:
      return null;
  }
};