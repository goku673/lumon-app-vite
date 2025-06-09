export const inputFieldsGuardians = [
    {
      groupLabel: "Nombre del Profesor o Tutor:",
      layout: "grid grid-cols-1 md:grid-cols-3 gap-4",
      fields: [
        {
          name: "apellidoPaterno",
          type: "text",
          placeholder: "Apellido Paterno",
        },
        {
          name: "apellidoMaterno",
          type: "text",
          placeholder: "Apellido Materno",
        },
        {
          name: "nombres",
          type: "text",
          placeholder: "Nombre(s)",
        },
      ],
    },
    {
      groupLabel: "Correo electrónico:",
      fields: [
        {
          name: "email",
          type: "email",
          placeholder: "Ingrese un correo válido",
        },
      ],
    },
    {
        groupLabel: "Cédula de Identidad:",
        fields: [
          {
            name: "ci",
            type: "number",
            placeholder: "Ingrese un Ci número válido",
          },
        ],
      },
    {
      groupLabel: "Celular:",
      fields: [
        {
          name: "celular",
          type: "tel",
          placeholder: "Ingrese un número válido",
        },
      ],
    },
  ];


export const tutorTypeOptions = [
  { value: "", label: "Seleccione una opción" },
  { value: "Padre", label: "Padre" },
  { value: "Madre", label: "Madre" },
  { value: "Tutor", label: "Tutor" },
  { value: "Profesor", label: "Profesor" },
  { value: "Otro", label: "Otro" },
];

export const completeGuardianFields = [
  {
    groupLabel: "Buscar y seleccionar Tutores:",
    fields: [
      {
        type: "selector",
        selectedItemsKey: "selectedGuardians",
        isMultiSelect: true,
        placeholder: "Buscar tutor...",
        labelKey: "name",
        description: "Seleccione tutores existentes o registre uno nuevo"
      }
    ]
  },
  ...inputFieldsGuardians,
  {
    groupLabel: "Tipo de Tutor:",
    fields: [
      {
        type: "select",
        name: "tipo",
        options: tutorTypeOptions
      }
    ]
  },
  {
    groupLabel: "Comprobante de pago:",
    fields: [
      {
        type: "file",
        name: "comprobantePago",
        accept: ".pdf,.jpg,.jpeg,.png",
        label: "Subir archivo"
      }
    ]
  }
];

// Función auxiliar para renderizar diferentes tipos de campos
export const renderField = (field, formData, handleChange, customHandlers = {}) => {
  const { handleGuardianSelect, handleGuardianRemove } = customHandlers;
  
  switch (field.type) {
    case "selector":
      return {
        component: "Selector",
        props: {
          items: field.items || [], // Se debe pasar desde el componente
          selectedItems: formData[field.selectedItemsKey] || [],
          onSelect: handleGuardianSelect,
          onRemove: handleGuardianRemove,
          isMultiSelect: field.isMultiSelect || true,
          placeholder: field.placeholder || "Buscar...",
          labelKey: field.labelKey || "name"
        }
      };
    case "select":
      return {
        component: "Select",
        props: {
          name: field.name,
          className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500",
          value: formData[field.name] || "",
          onChange: handleChange,
          options: field.options || []
        }
      };
    case "file":
      return {
        component: "FileUploader",
        props: {
          name: field.name,
          onChange: handleChange,
          accept: field.accept || ".pdf,.jpg,.jpeg,.png",
          label: field.label || "Subir archivo"
        }
      };
    default:
      return {
        component: "Input",
        props: {
          type: field.type || "text",
          name: field.name,
          placeholder: field.placeholder || "",
          value: formData[field.name] || "",
          onChange: handleChange,
          className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        }
      };
  }
};