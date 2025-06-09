"use client"

import { useState } from "react"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import Button from "../common/button"
import Input from "../common/input"
import Select from "../common/select"
import FormGroup from "./formGroup"
import FileUploader from "./fileUploader"
import FormContainer from "../common/formContainer"
import FormContent from "../common/formContent"
import Title from "../common/title"
import Text from "../common/text"
import { useGetGuardiansQuery, usePostIncriptionGuardianMutation } from "../app/redux/services/guardiansApi"
import { completeGuardianFields, renderField } from "../utils/inputFieldsGuardians"
import Selector from "./selector"
import Modal from "./modal/modal"

const GuardianRegister = ({ onSubmit, initialData }) => {
  const { data: guardians = [], refetch: refetchGuardians } = useGetGuardiansQuery()
  const [createGuardian, { isLoading: isCreatingGuardian }] = usePostIncriptionGuardianMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" })

  const [formData, setFormData] = useState({
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    email: "",
    celular: "",
    ci: "",
    comprobantePago: null,
    tipo: "",
    selectedGuardians: [],
    ...initialData,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "comprobantePago" && files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleGuardianSelect = (guardian) => {
    setFormData((prev) => ({
      ...prev,
      selectedGuardians: [...prev.selectedGuardians, guardian],
    }))
  }

  const handleGuardianRemove = (guardian) => {
    setFormData((prev) => ({
      ...prev,
      selectedGuardians: prev.selectedGuardians.filter((g) => g.id !== guardian.id),
    }))
  }

  // 🔥 Función para validar datos del formulario manual
  const isManualFormValid = () => {
    const { apellidoPaterno, apellidoMaterno, nombres, email, celular, ci, tipo } = formData
    return apellidoPaterno && apellidoMaterno && nombres && email && celular && ci && tipo
  }

  // 🔥 Función para registrar tutor individual
  const handleRegisterGuardian = async (e) => {
    e.preventDefault()

    if (!isManualFormValid()) {
      setIsModalOpen(true)
      return
    }

    try {
      // Preparar datos para el backend
      const guardianData = {
        name: formData.nombres,
        last_name: `${formData.apellidoPaterno} ${formData.apellidoMaterno}`,
        email: formData.email,
        ci: formData.ci,
        phone: formData.celular,
        type: formData.tipo,
      }

      console.log("🚀 Registrando tutor:", guardianData)

      // Crear el tutor
      const result = await createGuardian(guardianData).unwrap()
      console.log("✅ Tutor creado:", result)

      // Limpiar formulario manual
      setFormData((prev) => ({
        ...prev,
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
        email: "",
        celular: "",
        ci: "",
        tipo: "",
      }))

      // Refrescar lista de tutores
      await refetchGuardians()

      // Mostrar mensaje de éxito
      setSuccessModal({
        isOpen: true,
        message: `Tutor "${result.name} ${result.last_name}" registrado exitosamente. Ahora puedes seleccionarlo en la lista.`,
      })
    } catch (error) {
      console.error("❌ Error creando tutor:", error)
      setSuccessModal({
        isOpen: true,
        message: `Error al registrar tutor: ${error.data?.message || error.message || "Error desconocido"}`,
      })
    }
  }

  // 🔥 Función para continuar con tutores seleccionados
  const handleContinue = (e) => {
    e.preventDefault()

    if (formData.selectedGuardians.length === 0) {
      setIsModalOpen(true)
      return
    }

    onSubmit(formData)
  }

  const renderComponent = (fieldConfig) => {
    const { component, props } = renderField(fieldConfig, formData, handleChange, {
      handleGuardianSelect,
      handleGuardianRemove,
    })

    switch (component) {
      case "Selector":
        return <Selector {...props} items={guardians} />
      case "Select":
        return <Select {...props} />
      case "FileUploader":
        return (
          <>
            <FileUploader {...props} />
            {formData[fieldConfig.name] && (
              <p className="mt-2 text-sm text-green-600">Archivo seleccionado: {formData[fieldConfig.name].name}</p>
            )}
          </>
        )
      case "Input":
        return <Input {...props} />
      default:
        return null
    }
  }

  return (
    <>
      <FormContainer>
        <Title title="DATOS DE PROFESOR/TUTOR (OPCIONAL)" className="text-xl md:text-2xl font-medium mb-6" />

        {formData.selectedGuardians.length > 0 ? (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Text
              text={`✅ Has seleccionado ${formData.selectedGuardians.length} tutor(es). Puedes continuar o registrar más tutores.`}
              className="text-green-700 font-medium"
            />
            <div className="mt-2">
              {formData.selectedGuardians.map((guardian, index) => (
                <span
                  key={guardian.id}
                  className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 mb-1"
                >
                  {guardian.name} {guardian.last_name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <Text text="Selecciona tutores existentes o registra uno nuevo" className="text-lg font-medium mb-2" />
        )}

        <FormContent>
          {completeGuardianFields.map((group, index) => (
            <FormGroup key={index} label={group.groupLabel}>
              <div className={group.layout || ""}>
                {group.fields.map((field, fieldIndex) => (
                  <div key={`${field.name || field.type}-${fieldIndex}`}>{renderComponent(field)}</div>
                ))}
              </div>
            </FormGroup>
          ))}

          {/* 🔥 Botones separados para diferentes acciones */}
          <div className="space-y-4">
            {/* Botón para registrar tutor individual */}
            <Button
              type="button"
              onClick={handleRegisterGuardian}
              disabled={!isManualFormValid() || isCreatingGuardian}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PersonAddIcon className="mr-2" />
              {isCreatingGuardian ? "Registrando..." : "Registrar Tutor"}
            </Button>

            {/* Botón para continuar */}
            <Button
              type="button"
              onClick={handleContinue}
              disabled={formData.selectedGuardians.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowForwardIcon className="mr-2" />
              Continuar ({formData.selectedGuardians.length} tutor{formData.selectedGuardians.length !== 1 ? "es" : ""}{" "}
              seleccionado{formData.selectedGuardians.length !== 1 ? "s" : ""})
            </Button>
          </div>
        </FormContent>
      </FormContainer>

      {/* Modal de datos incompletos */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Datos Incompletos"
        primaryButtonText="Entendido"
        onPrimaryClick={() => setIsModalOpen(false)}
      >
        <p>Por favor, selecciona tutores existentes o completa todos los campos para registrar un nuevo tutor.</p>
      </Modal>

      {/* Modal de éxito/error */}
      <Modal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        title={successModal.message.includes("Error") ? "Error" : "Éxito"}
        iconType={successModal.message.includes("Error") ? "error" : "success"}
        primaryButtonText="Entendido"
        onPrimaryClick={() => setSuccessModal({ isOpen: false, message: "" })}
      >
        <p>{successModal.message}</p>
      </Modal>
    </>
  )
}

export default GuardianRegister
