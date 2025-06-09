import { useState, useEffect, useRef } from "react"
import { usePostIncriptionAreaMutation } from "../app/redux/services/areaApi"
import Button from "../common/button"
import Modal from "./modal/modal"
import FormContainer from "../common/formContainer"
import FormContent from "../common/formContent"
import FormGroup from "./formGroup"
import SaveIcon from "@mui/icons-material/Save"
import { areaFields,renderField } from "../utils/inputFieldsArea"
import RenderComponent from "./RenderComponent"
import * as XLSX from 'xlsx'
import useExcelProcessor from "../app/services/exel/ExcelProcessor"
import BatchProcessingUI from "../app/services/exel/BatchProcessingUI"
import CircularProgress from '@mui/material/CircularProgress'

const RegisterArea = () => {
  const [createArea] = usePostIncriptionAreaMutation()
  const processingRef = useRef(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    wordCount: 0
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalType, setModalType] = useState("success")

  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const templateHeaders = ["name", "description"]
  const templateExample = ["Matemáticas", "Área de matemáticas y lógica"]

  const excelProcessor = useExcelProcessor({
    processRecord: async (record) => {
      if (!record.name) throw new Error("Datos incompletos en el registro")
      const resp = await createArea({ name: record.name, description: record.description || "" }).unwrap()
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
      
      // Usar setTimeout para asegurar que el modal de carga se cierre primero
      setTimeout(() => {
        setModalType(success > 0 ? "success" : "warning")
        setModalMessage(`Procesamiento completado. ${success} exitosos, ${failed} fallidos.`)
        setIsModalOpen(true)
      }, 500)
    },
    onError: (error) => {
      processingRef.current = false
      setIsLoading(false)
      
      // Usar setTimeout para asegurar que el modal de carga se cierre primero
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
  }, [formData.description])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value
    const words = value.trim() ? value.trim().split(/\s+/) : []
    if (words.length <= 10) {
      setFormData(prev => ({ ...prev, description: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setModalType("error")
      setModalMessage("El nombre del área es requerido")
      setIsModalOpen(true)
      return
    }

    try {
      await createArea({ name: formData.name, description: formData.description }).unwrap()
      setModalType("success")
      setModalMessage("Área creada exitosamente!")
      setIsModalOpen(true)
      setFormData({ name: "", description: "", wordCount: 0 })
    } catch (error) {
      setModalType("error")
      setModalMessage(error.data?.message || "Error al crear el área")
      setIsModalOpen(true)
    }
  }

  const handleProcessRecords = (records) => {
    // Limpiar listas anteriores antes de procesar nuevos registros
    excelProcessor.clearResults()
    
    // Establecer el estado de procesamiento
    processingRef.current = true
    setIsLoading(true)
    setLoadingMessage(`Procesando 0 de ${records.length} registros...`)
    
    // Iniciar el procesamiento
    excelProcessor.processRecords(records)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Asegurarse de que el modal de carga también esté cerrado
    setIsLoading(false)
  }

  return (
    <FormContainer className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center">
        Crear Nueva Área
      </h2>

      <BatchProcessingUI
        title="Carga Masiva por Excel"
        onProcessRecords={handleProcessRecords}
        onExportResults={() => excelProcessor.exportResults("resultados_areas")}
        templateHeaders={templateHeaders}
        templateExample={templateExample}
        processor={excelProcessor}
        className="mb-8"
      />

      <h3 className="text-lg font-semibold mb-4 text-gray-700">Registro Manual</h3>
      <FormContent onSubmit={handleSubmit} className="space-y-6">
        {areaFields.map((group, idx) => (
          <FormGroup
            key={idx}
            label={group.groupLabel}
            error={
              (modalType === "error" && !formData.name.trim()) ||
              (group.fields.some(f => f.name === 'description') && formData.wordCount > 10)
                ? modalMessage
                : ""
            }
            className="mb-6"
          >
            <div className={group.layout || ""}>
              {group.fields.map((field, fIdx) => (
                <div key={`${field.name}-${fIdx}`}>
                  <RenderComponent
                    fieldConfig={field}
                    formData={formData}
                    handlers={{ handleChange, handleDescriptionChange }}
                    dataProviders={{}}
                    renderField={renderField}
                  />
                </div>
              ))}
            </div>
          </FormGroup>
        ))}

        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            className="bg-[#0f2e5a] hover:bg-white border-[#0f2e5a] border-2 hover:text-[#0f2e5a] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center"
            disabled={!formData.name.trim() || formData.wordCount > 10}
          >
            <SaveIcon className="mr-2" />
            Crear Área
          </Button>
        </div>
      </FormContent>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalType === "success" ? "Éxito" : modalType === "warning" ? "Advertencia" : "Error"}
        iconType={modalType}
        primaryButtonText="Aceptar"
        onPrimaryClick={handleCloseModal}
      >
        <p className="text-gray-700">{modalMessage}</p>

        {(excelProcessor.successList.length > 0 || excelProcessor.failedList.length > 0) && (
          <div className="mt-4">
            {excelProcessor.successList.length > 0 && (
              <div className="mb-2">
                <p className="font-bold text-green-500">Registros exitosos ({excelProcessor.successList.length}):</p>
                <ul className="max-h-40 overflow-y-auto">
                  {excelProcessor.successList.map((item, i) => (
                    <li key={`success-${i}`} className="text-sm">Área: {item.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {excelProcessor.failedList.length > 0 && (
              <div>
                <p className="font-bold text-red-500">Registros fallidos ({excelProcessor.failedList.length}):</p>
                <ul className="max-h-40 overflow-y-auto">
                  {excelProcessor.failedList.map((item, i) => (
                    <li key={`failed-${i}`} className="text-sm">Área: {item.name} - Error: {item.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isLoading}
        onClose={() => {}}
        title="Procesando"
        iconType="info"
        primaryButtonText={null}
        showCloseButton={false}
      >
        <div className="flex items-center justify-center p-4">
          <CircularProgress size={24} className="mr-3" />
          <p>{loadingMessage}</p>
        </div>
      </Modal>
    </FormContainer>
  )
}

export default RegisterArea;
