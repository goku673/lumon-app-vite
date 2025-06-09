"use client"

import { useState, useEffect, useRef } from "react"
import { usePostIncriptionLevelsMutation } from "../app/redux/services/levelsApi"
import Button from "../common/button"
import Modal from "./modal/modal"
import FormContainer from "../common/formContainer"
import FormContent from "../common/formContent"
import FormGroup from "./formGroup"
import SaveIcon from "@mui/icons-material/Save"
import { levelFields, renderField } from "../utils/inputFieldLevel"
import RenderComponent from "./RenderComponent"
import useExcelProcessor from "../app/services/exel/ExcelProcessor"
import BatchProcessingUI from "../app/services/exel/BatchProcessingUI"
import CircularProgress from "@mui/material/CircularProgress"

const RegisterLevel = () => {
  const [createLevel] = usePostIncriptionLevelsMutation()
  const processingRef = useRef(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    wordCount: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalType, setModalType] = useState("success")
  const [isDescriptionValid, setIsDescriptionValid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const templateHeaders = ["name", "description"]
  const templateExample = ["Básico", "Nivel básico de educación"]

  const excelProcessor = useExcelProcessor({
    processRecord: async (record) => {
      if (!record.name) throw new Error("Datos incompletos en el registro")
      const resp = await createLevel({
        name: record.name,
        description: record.description || "",
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
    },
  })

  useEffect(() => {
    const words = formData.description.trim() ? formData.description.trim().split(/\s+/) : []
    setFormData((prev) => ({ ...prev, wordCount: words.length }))
    setIsDescriptionValid(words.length <= 10)
  }, [formData.description])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

 
  const handleDescriptionChange = (e) => {
    const newText = e.target.value
    
    setFormData((prev) => ({ ...prev, description: newText }))

    const words = newText.trim() ? newText.trim().split(/\s+/) : []
    setIsDescriptionValid(words.length <= 10)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setModalType("error")
      setModalMessage("El nombre del nivel es requerido")
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
      await createLevel({ name: formData.name, description: formData.description }).unwrap()
      setModalType("success")
      setModalMessage("Nivel creado exitosamente!")
      setIsModalOpen(true)
      setFormData({
        name: "",
        description: "",
        wordCount: 0,
      })
    } catch (error) {
      console.error("Error creating level:", error)
      setModalType("error")
      setModalMessage(error.data?.message || "Error al crear el nivel")
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
          handleDescriptionChange,
        }}
        dataProviders={{}}
        renderField={renderField}
      />
    )
  }

  const handleProcessRecords = (records) => {
    excelProcessor.clearResults?.() || []
    processingRef.current = true
    setIsLoading(true)
    setLoadingMessage(`Procesando 0 de ${records.length} registros...`)
    excelProcessor.processRecords(records)
  }

  // const handleCloseModal = () => {
  //   setIsModalOpen(false)
  //   setIsLoading(false)
  // }

  return (
    <FormContainer className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Crear Nuevo Nivel</h2>

      <BatchProcessingUI
        title="Carga Masiva por Excel"
        onProcessRecords={handleProcessRecords}
        onExportResults={() => excelProcessor.exportResults("resultados_niveles")}
        templateHeaders={templateHeaders}
        templateExample={templateExample}
        processor={excelProcessor}
        className="mb-8"
      />

      <h3 className="text-lg font-semibold mb-4 text-gray-700">Registro Manual</h3>

      <FormContent onSubmit={handleSubmit} className="space-y-6">
        {levelFields.map((group, index) => (
          <FormGroup
            key={index}
            label={group.groupLabel}
            error={(modalType === "error" && !formData.name.trim()) || !isDescriptionValid ? modalMessage : ""}
            className="mb-6"
          >
            <div className={group.layout || ""}>
              {group.fields.map((field, fieldIndex) => (
                <div key={`${field.name}-${fieldIndex}`}>{renderComponent(field)}</div>
              ))}
            </div>
          </FormGroup>
        ))}

        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            className="bg-[#0f2e5a] hover:bg-white border-[#0f2e5a] border-2 hover:text-[#0f2e5a] text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center"
            disabled={!isDescriptionValid || !formData.name.trim()}
          >
            <SaveIcon className="mr-2" fontSize="small" />
            Crear Nivel
          </Button>
        </div>
      </FormContent>

      <Modal isOpen={isLoading} title="Procesando" showCloseButton={false} showButtons={false}>
        <div className="flex flex-col items-center justify-center py-4">
          <CircularProgress color="error" className="mb-4" />
          <p>{loadingMessage}</p>
        </div>
      </Modal>
    </FormContainer>
  )
}

export default RegisterLevel
