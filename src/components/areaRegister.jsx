
import { useState, useEffect } from "react"
import { usePostIncriptionAreaMutation } from "../app/redux/services/areaApi"
import Button from "../common/button"
import Modal from "./modal/modal"
import FormContainer from "../common/formContainer"
import FormContent from "../common/formContent"
import FormGroup from "./formGroup"
import SaveIcon from "@mui/icons-material/Save"
import { areaFields, renderField } from "../utils/inputFieldsArea"
import RenderComponent from "./RenderComponent"

const RegisterArea = () => {
  const [createArea] = usePostIncriptionAreaMutation()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    wordCount: 0,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalType, setModalType] = useState("success")

  useEffect(() => {
    const words = formData.description.trim() ? formData.description.trim().split(/\s+/) : []
    setFormData((prev) => ({ ...prev, wordCount: words.length }))
  }, [formData.description])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value
    const words = value.trim() ? value.trim().split(/\s+/) : []
    if (words.length <= 10) {
      setFormData((prev) => ({ ...prev, description: value }))
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

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <FormContainer className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center">Crear Nueva Área</h2>

      <FormContent onSubmit={handleSubmit} className="space-y-6">
        {areaFields.map((group, idx) => (
          <FormGroup
            key={idx}
            label={group.groupLabel}
            error={
              (modalType === "error" && !formData.name.trim()) ||
              (group.fields.some((f) => f.name === "description") && formData.wordCount > 10)
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
      </Modal>
    </FormContainer>
  )
}

export default RegisterArea
