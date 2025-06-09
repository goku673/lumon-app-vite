import { getTransformedGradeNameByDescription, getOriginalGradeDescriptionByTransformed } from "./gradeTransFormed"

export const inputFieldsCompetitor = [
  {
    groupLabel: "Nombre del Competidor:",
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
    groupLabel: "Información de Contacto:",
    layout: "grid grid-cols-1 md:grid-cols-3 gap-4",
    fields: [
      {
        name: "email",
        type: "email",
        placeholder: "Ingrese un correo válido",
      },
      {
        name: "cedula",
        type: "text",
        placeholder: "Ingrese CI",
      },
      {
        name: "fechaNacimiento",
        type: "text",
        placeholder: "Ejemplo: 10/02/2024",
        pattern: "\\d{2}/\\d{2}/\\d{4}",
      },
      {
        name: "celular",
        type: "text",
        placeholder: "Ejemplo: 78952345",
      },
    ],
  },
  {
    groupLabel: "Seleccione su Colegio:",
    fields: [
      {
        type: "selector",
        name: "colegio",
        selectedItemsKey: "colegio",
        isMultiSelect: false,
        placeholder: "Buscar colegio...",
        labelKey: "name",
        dataKey: "schools",
        loadingKey: "isSchoolsLoading",
        errorKey: "isSchoolsError",
        loadingMessage: "Cargando colegios...",
        errorMessage: "Error al cargar colegios.",
      },
    ],
  },
  {
    groupLabel: "Información Académica:",
    layout: "grid grid-cols-1 md:grid-cols-3 gap-4",
    fields: [
      {
        type: "select",
        name: "curso",
        dataKey: "grades",
        loadingKey: "isGradesLoading",
        errorKey: "isGradesError",
        loadingMessage: "Cargando cursos...",
        errorMessage: "Error al cargar cursos",
        valueField: "description", // Las opciones usan description
        labelField: "description", // Las opciones muestran description
        transformValue: true, // Necesita transformación
        transformFunction: getTransformedGradeNameByDescription, // Para guardar
        reverseTransformFunction: getOriginalGradeDescriptionByTransformed, // 🔥 Para mostrar
      },
      {
        type: "select",
        name: "departamento",
        dataKey: "departments",
        loadingKey: "isDepartmentsLoading",
        errorKey: "isDepartmentsError",
        loadingMessage: "Cargando departamentos...",
        errorMessage: "Error al cargar departamentos",
        valueField: "id",
        labelField: "name",
      },
      {
        type: "select",
        name: "provincia",
        dataKey: "provinces",
        loadingKey: "isProvincesLoading",
        errorKey: "isProvincesError",
        loadingMessage: "Cargando provincias...",
        errorMessage: "Error al cargar provincias",
        valueField: "name",
        labelField: "name",
      },
    ],
  },
  {
    groupLabel: "Área:",
    fields: [
      {
        type: "selector",
        name: "area_level_grades",
        selectedItemsKey: "area_level_grades",
        isMultiSelect: true,
        placeholder: "Buscar nivel o grado...",
        labelKey: "name",
        dataKey: "flattenedGrades",
        loadingKey: "isAreaLevelGradesLoading",
        errorKey: "isAreaLevelGradesError",
        loadingMessage: "Cargando niveles...",
        errorMessage: "Error al cargar niveles",
      },
    ],
  },
]

export const renderField = (field, formData, handlers, dataProviders) => {
  const { handleChange } = handlers
  const { handleSchoolSelect, handleSchoolRemove, handleGradeSelect, handleGradeRemove } = handlers

  const data = field.dataKey ? dataProviders[field.dataKey] : null
  const isLoading = field.loadingKey ? dataProviders[field.loadingKey] : false
  const isError = field.errorKey ? dataProviders[field.errorKey] : false

  switch (field.type) {
    case "selector": {
      if (isLoading) {
        return { component: "Loading", message: field.loadingMessage || "Cargando..." }
      }
      if (isError) {
        return { component: "Error", message: field.errorMessage || "Error al cargar datos." }
      }

      let onSelect, onRemove
      if (field.name === "colegio") {
        onSelect = handleSchoolSelect
        onRemove = handleSchoolRemove
      } else if (field.name === "area_level_grades") {
        onSelect = handleGradeSelect
        onRemove = handleGradeRemove
      }

      return {
        component: "Selector",
        props: {
          items: data || [],
          selectedItems:
            field.name === "colegio"
              ? formData[field.name]
                ? [formData[field.name]]
                : []
              : formData[field.name] || [],
          onSelect,
          onRemove,
          isMultiSelect: field.isMultiSelect,
          placeholder: field.placeholder || "Buscar...",
          labelKey: field.labelKey || "name",
        },
      }
    }
    case "select": {
      let options = []
      if (isLoading) {
        options = [{ value: "", label: field.loadingMessage || "Cargando..." }]
      } else if (isError) {
        options = [{ value: "", label: field.errorMessage || "Error al cargar datos" }]
      } else if (data) {
        // 🔥 Para el campo curso, crear opciones con valores transformados
        if (field.name === "curso" && field.transformValue && field.transformFunction) {
          options = data.map((item) => {
            const originalDescription = item[field.valueField]
            const transformedValue = field.transformFunction(data, originalDescription)

            return {
              value: transformedValue, // 🔥 Usar valor transformado como value
              label: transformedValue, // 🔥 Mostrar valor transformado como label
              originalDescription: originalDescription, // Guardar referencia original
            }
          })
        } else {
          // Para otros campos, usar la lógica normal
          options = data.map((item) => ({
            value: item[field.valueField],
            label: item[field.labelField],
          }))
        }
      }

      // 🔥 Para campos con transformación, usar directamente el valor del formData
      const displayValue = formData[field.name] || ""

      // 🔥 Handler simplificado - no necesita transformación adicional para curso
      let customOnChange = handleChange

      // Para otros campos que puedan necesitar transformación en el futuro
      if (field.transformValue && field.transformFunction && data && field.name !== "curso") {
        customOnChange = (e) => {
          const selectedValue = e.target.value
          const transformedValue = field.transformFunction(data, selectedValue)

          const syntheticEvent = {
            target: {
              name: field.name,
              value: transformedValue,
            },
          }

          handleChange(syntheticEvent)
        }
      }

      return {
        component: "Select",
        props: {
          name: field.name,
          className:
            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500",
          value: displayValue,
          onChange: customOnChange,
          options,
          required: true,
        },
      }
    }
    default:
      return {
        component: "Input",
        props: {
          type: field.type || "text",
          name: field.name,
          placeholder: field.placeholder || "",
          pattern: field.pattern,
          value: formData[field.name] || "",
          onChange: handleChange,
          className:
            "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500",
          required: true,
        },
      }
  }
}
