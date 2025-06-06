import { useState, useEffect, useRef } from "react"
import { usePostIncriptionGradesMutation } from "../app/redux/services/gradesApi"
import Button from "../common/button"
import Modal from "./modal/modal"
import FormContainer from "../common/formContainer"
import FormContent from "../common/formContent"
import FormGroup from "./formGroup"
import Input from "../common/input"
import DescriptionIcon from "@mui/icons-material/Description"
import PaidIcon from "@mui/icons-material/Paid"
import SaveIcon from "@mui/icons-material/Save"
import CategoryIcon from "@mui/icons-material/Category"
import { gradeFields, renderField } from "../utils/inputFieldGrade"
import RenderComponent from "./RenderComponent"
import * as XLSX from 'xlsx'
import useExcelProcessor from "../app/services/exel/ExcelProcessor"
import BatchProcessingUI from "../app/services/exel/BatchProcessingUI"
import CircularProgress from '@mui/material/CircularProgress'

const RegisterGrade = () => {
  const [createGrade] = usePostIncriptionGradesMutation()
  const processingRef = useRef(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    wordCount: 0
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalType, setModalType] = useState("success")
  const [isDescriptionValid, setIsDescriptionValid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const templateHeaders = ["name", "description", "price"]
  const templateExample = ["Primero", "Grado primero", 100]

  const excelProcessor = useExcelProcessor({
    processRecord: async (record) => {
      if (!record.name || !record.price) throw new Error("Datos incompletos en el registro")
      const resp = await createGrade({ 
        name: record.name, 
        description: record.description || "", 
        price: Number.parseFloat(record.price) 
      }).unwrap()
      return resp
    },
    onProgress: ({ current, total }) => {
      if (processingRef.current) {
        setLoadingMessage(`Procesando ${current} de ${total} registros...`)
      }
    },
    onComplete: ({ success, failed }) => {
      processingRef.current = false
      setIsLoading(false)
      
      setTimeout(() => {
        setModalType(success > 0 ? "success" : "warning")
        setModalMessage(`Procesamiento completado. ${success} exitosos, ${failed} fallidos.`)
        setIsModalOpen(true)
      }, 500)
    },
    onError: (error) => {
      processingRef.current = false
      setIsLoading(false)
      
      setTimeout(() => {
        setModalType("error")
        setModalMessage(error.message || "Error en el procesamiento")
        setIsModalOpen(true)
      }, 500)
    }
  })

  useEffect(() => {
    const words = formData.description.trim() ? formData.description.trim().split(/\s+/) : []
    setFormData(prev => ({ ...prev, wordCount: words.length }))
    setIsDescriptionValid(words.length <= 10)
  }, [formData.description])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (e) => {
    const newText = e.target.value
    const words = newText.trim() ? newText.trim().split(/\s+/) : []

    if (words.length <= 10) {
      setFormData(prev => ({ ...prev, description: newText }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.price) {
      setModalType("error")
      setModalMessage("Todos los campos requeridos deben ser llenados")
      setIsModalOpen(true)
      return
    }

    if (!isDescriptionValid) {
      setModalType("error")
      setModalMessage("La descripción no puede tener más de 10 palabras")
      setIsModalOpen(true)
      return
    }

    try {
      await createGrade({ 
        name: formData.name, 
        description: formData.description, 
        price: Number.parseFloat(formData.price) 
      }).unwrap()
      setModalType("success")
      setModalMessage("Grado creado exitosamente!")
      setIsModalOpen(true)
      setFormData({
        name: "",
        description: "",
        price: "",
        wordCount: 0
      })
    } catch (error) {
      console.error("Error creating grade:", error)
      setModalType("error")
      setModalMessage(error.data?.message || "Error al crear el grado")
      setIsModalOpen(true)
    }
  }

  const renderComponent = (fieldConfig) => {
    return (
      <RenderComponent
        fieldConfig={fieldConfig}
        formData={formData}
        handlers={{
          handleChange,
          handleDescriptionChange
        }}
        dataProviders={{}}
        renderField={renderField}
      />
    );
  };

  const handleProcessRecords = (records) => {
    
    excelProcessor.clearResults?.() || []
    
    
    processingRef.current = true
    setIsLoading(true)
    setLoadingMessage(`Procesando 0 de ${records.length} registros...`)
    
    // Iniciar el procesamiento
    excelProcessor.processRecords(records)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    
    setIsLoading(false)
  }

  return (
    <FormContainer className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center">
        Crear Nuevo Grado
      </h2>

      <BatchProcessingUI
        title="Carga Masiva por Excel"
        onProcessRecords={handleProcessRecords}
        onExportResults={() => excelProcessor.exportResults("resultados_grados")}
        templateHeaders={templateHeaders}
        templateExample={templateExample}
        processor={excelProcessor}
        className="mb-8"
      />

      <h3 className="text-lg font-semibold mb-4 text-gray-700">Registro Manual</h3>
      
      <FormContent onSubmit={handleSubmit} className="space-y-6">
        {gradeFields.map((group, index) => (
          <FormGroup 
            key={index} 
            label={group.groupLabel}
            error={
              (modalType === "error" && !formData.name.trim()) || 
              (!isDescriptionValid) ? 
              modalMessage : ""
            }
            className="mb-6"
          >
            <div className={group.layout || ""}>
              {group.fields.map((field, fieldIndex) => (
                <div key={`${field.name}-${fieldIndex}`}>
                  {renderComponent(field)}
                </div>
              ))}
            </div>
          </FormGroup>
        ))}

        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            className="bg-[#0f2e5a] hover:bg-white border-[#0f2e5a] border-2 hover:text-[#0f2e5a] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center"
            disabled={!isDescriptionValid || !formData.name.trim() || !formData.price}
          >
            <SaveIcon className="mr-2" />
            Crear Grado
          </Button>
        </div>
      </FormContent>

      <Modal
        isOpen={isLoading}
        title="Procesando"
        showCloseButton={false}
        showButtons={false}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <CircularProgress color="error" className="mb-4" />
          <p>{loadingMessage}</p>
        </div>
      </Modal>
    </FormContainer>
  )
}

export default RegisterGrade
