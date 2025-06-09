import { useState, useEffect } from "react"
import { useGetSchoolsQuery } from "../app/redux/services/schoolApi"
import { useGetGradesQuery } from "../app/redux/services/gradesApi"
import { useGetDepartmentsQuery } from "../app/redux/services/areaApi"
import { useGetProvincesQuery } from "../app/redux/services/areaApi"
import { useGetOlympicByIdQuery } from "../app/redux/services/olympicsApi"
import { inputFieldsCompetitor, renderField } from "../utils/inputFieldsCompetitor"
import { transformCompetitorDataForBackend, validateTransformedData } from "../utils/dataTransFormed"
import FormContainer from "../common/formContainer"
import FormContent from "../common/formContent"
import FormGroup from "./formGroup"
import Button from "../common/button"
import RenderComponent from "./RenderComponent"
import { useSelector } from "react-redux"

const CompetitorRegister = ({ onSubmit, onBack, initialData = {}, guardians = [] }) => {
  const selectedOlympic = useSelector((state) => state.olympic.selectedOlympic)

  // Obtener detalles de la olimpiada seleccionada (incluyendo sus áreas)
  const {
    data: olympicDetails,
    isLoading: isOlympicLoading,
    isError: isOlympicError,
  } = useGetOlympicByIdQuery(selectedOlympic?.id, {
    skip: !selectedOlympic?.id,
  })

  const [formData, setFormData] = useState({
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    email: "",
    cedula: "",
    fechaNacimiento: "",
    celular: "",
    colegio: null,
    curso: "",
    departamento: "",
    provincia: "",
    area_level_grades: [],
    ...initialData,
  })

  const [selectedSchool, setSelectedSchool] = useState(initialData.colegio || null)
  const [selectedGrades, setSelectedGrades] = useState(initialData.area_level_grades || [])
  const [validationErrors, setValidationErrors] = useState([])

  // Queries para obtener datos (sin useGetAreaLevelsGradesQuery)
  const { data: schools = [], isLoading: isSchoolsLoading, isError: isSchoolsError } = useGetSchoolsQuery()
  const { data: grades = [], isLoading: isGradesLoading, isError: isGradesError } = useGetGradesQuery()
  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useGetDepartmentsQuery()
  const { data: provinces = [], isLoading: isProvincesLoading, isError: isProvincesError } = useGetProvincesQuery()

  // Usar las áreas de la olimpiada seleccionada en lugar de todas las áreas
  const flattenedGrades =
    olympicDetails?.areas_levels_grades?.map((area) => ({
      id: area.id,
      name: `${area.area} - ${area.level} - ${area.grade}`,
      area: area.area,
      level: area.level,
      grade: area.grade,
      status: area.status,
      // No tenemos price en los datos de la olimpiada, pero podemos agregarlo si es necesario
    })) || []

  // Filtrar solo las áreas activas
  const activeGrades = flattenedGrades.filter((grade) => grade.status === "active")

  const dataProviders = {
    schools,
    grades,
    departments,
    provinces,
    flattenedGrades: activeGrades, // Usar solo las áreas activas de la olimpiada
    isSchoolsLoading,
    isGradesLoading,
    isDepartmentsLoading,
    isProvincesLoading,
    isAreaLevelGradesLoading: isOlympicLoading, // Usar el loading de la olimpiada
    isSchoolsError,
    isGradesError,
    isDepartmentsError,
    isProvincesError,
    isAreaLevelGradesError: isOlympicError, // Usar el error de la olimpiada
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school)
    setFormData((prev) => ({ ...prev, colegio: school }))
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleSchoolRemove = () => {
    setSelectedSchool(null)
    setFormData((prev) => ({ ...prev, colegio: null }))
  }

  const handleGradeSelect = (grade) => {
    const newSelectedGrades = [...selectedGrades, grade]
    setSelectedGrades(newSelectedGrades)
    setFormData((prev) => ({ ...prev, area_level_grades: newSelectedGrades }))
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleGradeRemove = (gradeToRemove) => {
    const newSelectedGrades = selectedGrades.filter((grade) => grade.id !== gradeToRemove.id)
    setSelectedGrades(newSelectedGrades)
    setFormData((prev) => ({ ...prev, area_level_grades: newSelectedGrades }))
  }

  const handlers = {
    handleChange,
    handleSchoolSelect,
    handleSchoolRemove,
    handleGradeSelect,
    handleGradeRemove,
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar que hay una olimpiada seleccionada
    if (!selectedOlympic?.id) {
      setValidationErrors(["Debe seleccionar una olimpiada antes de registrar un competidor"])
      return
    }

    // Transformar los datos al formato del backend
    const transformedData = transformCompetitorDataForBackend(formData, guardians, selectedOlympic?.id)

    // Validar los datos transformados
    const validation = validateTransformedData(transformedData)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      console.error("Errores de validación:", validation.errors)
      return
    }

    console.log("=== DATOS ORIGINALES DEL FORMULARIO ===")
    console.log(formData)
    console.log("\n=== DATOS TRANSFORMADOS PARA EL BACKEND ===")
    console.log(transformedData)
    console.log("\n=== ÁREAS DISPONIBLES DE LA OLIMPIADA ===")
    console.log("Olimpiada:", selectedOlympic?.name)
    console.log("Áreas activas:", activeGrades)

    // Enviar los datos transformados
    onSubmit(transformedData)
  }

  useEffect(() => {
    if (formData.curso) {
      console.log("Curso seleccionado (transformado):", formData.curso)
    }
  }, [formData.curso])

  // Mostrar mensaje si no hay olimpiada seleccionada
  if (!selectedOlympic?.id) {
    return (
      <FormContainer className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-100">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Selecciona una Olimpiada</h2>
          <p className="text-gray-600 mb-6">Debes seleccionar una olimpiada antes de poder registrar un competidor.</p>
          <Button
            type="button"
            onClick={onBack}
            className="bg-[#0f2e5a] hover:bg-[#1a4a7a] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Volver a Seleccionar Olimpiada
          </Button>
        </div>
      </FormContainer>
    )
  }

  return (
    <FormContainer className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Registro de Competidor</h2>

        {/* Información de la olimpiada seleccionada */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800">Olimpiada Seleccionada:</h3>
          <p className="text-blue-700">{selectedOlympic.name}</p>
          <p className="text-sm text-blue-600">{activeGrades.length} áreas disponibles para inscripción</p>
        </div>
      </div>

      {/* Mostrar errores de validación */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-semibold mb-2">Errores de validación:</h3>
          <ul className="list-disc list-inside text-red-700">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Mostrar mensaje si no hay áreas disponibles */}
      {olympicDetails && activeGrades.length === 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-yellow-800 font-semibold mb-2">Sin áreas disponibles</h3>
          <p className="text-yellow-700">Esta olimpiada no tiene áreas activas disponibles para inscripción.</p>
        </div>
      )}

      <FormContent onSubmit={handleSubmit} className="space-y-6">
        {inputFieldsCompetitor.map((group, groupIndex) => (
          <FormGroup key={groupIndex} label={group.groupLabel} className="mb-6">
            <div className={group.layout || "space-y-4"}>
              {group.fields.map((field, fieldIndex) => (
                <div key={`${field.name}-${fieldIndex}`}>
                  <RenderComponent
                    fieldConfig={field}
                    formData={formData}
                    handlers={handlers}
                    dataProviders={dataProviders}
                    renderField={renderField}
                  />
                </div>
              ))}
            </div>
          </FormGroup>
        ))}

        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Atrás
          </Button>
          <Button
            type="submit"
            className="bg-[#0f2e5a] hover:bg-[#1a4a7a] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            disabled={activeGrades.length === 0}
          >
            Registrar Competidor
          </Button>
        </div>
      </FormContent>

      {/* Mostrar datos actuales para debugging */}
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold mb-2">Vista previa de datos transformados:</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(transformCompetitorDataForBackend(formData, guardians, selectedOlympic?.id), null, 2)}
        </pre>

        <h3 className="font-bold mb-2 mt-4">Áreas disponibles de la olimpiada:</h3>
        <pre className="text-sm overflow-auto">{JSON.stringify(activeGrades, null, 2)}</pre>
      </div>
    </FormContainer>
  )
}

export default CompetitorRegister
