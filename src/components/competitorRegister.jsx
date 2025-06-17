"use client"

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
import { useGetUserQuery } from "../app/redux/services/authApi"

const CompetitorRegister = ({ onSubmit, onBack, initialData = {}, guardians = [] }) => {
  const selectedOlympic = useSelector((state) => state.olympic.selectedOlympic)

  
  const [token, setToken] = useState(null)
  const { data: user } = useGetUserQuery(token, { skip: !token })

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

 
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

  const { data: schools = [], isLoading: isSchoolsLoading, isError: isSchoolsError } = useGetSchoolsQuery()
  const { data: grades = [], isLoading: isGradesLoading, isError: isGradesError } = useGetGradesQuery()
  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useGetDepartmentsQuery()
  const { data: provinces = [], isLoading: isProvincesLoading, isError: isProvincesError } = useGetProvincesQuery()

 
  const flattenedGrades =
    olympicDetails?.areas_levels_grades?.map((area) => ({
      id: area.id,
      name: `${area.area} - ${area.level} - ${area.grade}`,
      area: area.area,
      level: area.level,
      grade: area.grade,
      status: area.status,
    })) || []

  const activeGrades = flattenedGrades.filter((grade) => grade.status === "active")

  const dataProviders = {
    schools,
    grades,
    departments,
    provinces,
    flattenedGrades: activeGrades,
    isSchoolsLoading,
    isGradesLoading,
    isDepartmentsLoading,
    isProvincesLoading,
    isAreaLevelGradesLoading: isOlympicLoading,
    isSchoolsError,
    isGradesError,
    isDepartmentsError,
    isProvincesError,
    isAreaLevelGradesError: isOlympicError,
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    

    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      
      return newData
    })

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

    if (!selectedOlympic?.id) {
      setValidationErrors(["Debe seleccionar una olimpiada antes de registrar un competidor"])
      return
    }

    const transformedData = transformCompetitorDataForBackend(formData, guardians, selectedOlympic?.id)


    const validation = validateTransformedData(transformedData)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      console.error("Errores de validación:", validation.errors)
      return
    }

  

    
    onSubmit(transformedData)
  }

 
  useEffect(() => {
    console.log("🎓 Curso actualizado en formData:", formData.curso)
  }, [formData.curso])

  
  useEffect(() => {
    if (initialData.colegio && !selectedSchool) {
      setSelectedSchool(initialData.colegio)
    }
    if (initialData.area_level_grades && selectedGrades.length === 0) {
      setSelectedGrades(initialData.area_level_grades)
    }
  }, [initialData, selectedSchool, selectedGrades.length])


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


  console.log("🔍 Debug valores que podrían causar el 0:");
  console.log("activeGrades.length:", activeGrades.length);
  console.log("validationErrors.length:", validationErrors.length);
  console.log("selectedGrades.length:", selectedGrades.length);
  console.log("schools.length:", schools.length);

  return (
    <FormContainer className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Registro de Competidor</h2>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800">Olimpiada Seleccionada:</h3>
          <p className="text-blue-700">{selectedOlympic.name}</p>
          <p className="text-sm text-blue-600">{activeGrades.length} áreas disponibles para inscripción</p>
        </div>
      </div>

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

  {Boolean(user?.is_admin) && (
    <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h3 className="font-bold mb-2">🐛 Debug - Estado actual del formulario:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold">Curso seleccionado:</h4>
                <p className="bg-white p-2 rounded border">{formData.curso || "No seleccionado"}</p>
              </div>
              <div>
                <h4 className="font-semibold">Áreas seleccionadas:</h4>
                <p className="bg-white p-2 rounded border">{selectedGrades.length} área(s)</p>
              </div>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Ver datos completos</summary>
              <pre className="text-xs overflow-auto mt-2 bg-white p-2 rounded border">
                {JSON.stringify({ formData, selectedGrades, activeGrades: activeGrades.length }, null, 2)}
              </pre>
            </details>
          </div>
        )}
    </FormContainer>
  )
}

export default CompetitorRegister