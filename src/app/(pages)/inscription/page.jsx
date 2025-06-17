import { useState } from "react"
import { usePostInscriptionCompetitorMutation } from "../../redux/services/competitorsApi"
import { usePostIncriptionGuardianMutation, useGetGuardiansQuery } from "../../redux/services/guardiansApi"
import {
  useGeneratePaymentByInscriptionMutation,
  useValidatePaymentFromImageMutation,
} from "../../redux/services/paymentOrdersApi"
import { useSelector } from "react-redux"
import InscriptionForm from "../../../components/InscriptionForm"
import AuthGuard from "../../../components/AuthGuard"

const Incription = () => {
  const selectedOlympic = useSelector((state) => state.olympic.selectedOlympic)
  const [step, setStep] = useState(1)
  const { refetch: refetchGuardians } = useGetGuardiansQuery()

  // Estados existentes
  const [competitorData, setCompetitorData] = useState({})
  const [guardiansData, setGuardiansData] = useState([])
  const [guardianDataReverse, setGuardianDataReverse] = useState({})
  const [animationDirection, setAnimationDirection] = useState("forward")

  // Estados para el flujo de pago
  const [paymentFlow, setPaymentFlow] = useState({
    inscriptionId: null,
    competitorId: null,
    paymentOrder: null,
    competitor: null,
    inscription: null,
    isGeneratingPayment: false,
    isValidatingPayment: false,
    paymentValidated: false,
    showPaymentModal: false,
    showUploadModal: false,
    paymentFile: null,
  })

  // Estados de modales
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" })
  const [loadingModal, setLoadingModal] = useState({
    isOpen: false,
    title: "Procesando",
    message: "Registrando competidor...",
  })

  // Mutations
  const [postIncriptionGuardian] = usePostIncriptionGuardianMutation()
  const [postIncriptionCompetitor] = usePostInscriptionCompetitorMutation()
  const [generatePaymentByInscription] = useGeneratePaymentByInscriptionMutation()
  const [validatePaymentFromImage] = useValidatePaymentFromImageMutation()

  const handleGuardianSubmit = async (data) => {
    try {
      if (
        data.selectedGuardians.length > 0 &&
        !(
          data.apellidoPaterno &&
          data.apellidoMaterno &&
          data.nombres &&
          data.email &&
          data.celular &&
          data.comprobantePago &&
          data.tipo
        )
      ) {
        setGuardiansData(data.selectedGuardians)
        setStep(2)
        setAnimationDirection("forward")
        return
      }

      setLoadingModal((prev) => ({ ...prev, isOpen: true, message: "Registrando tutor..." }))
      const response = await postIncriptionGuardian(data).unwrap()
      setGuardiansData((prev) => [...prev, response])
      setLoadingModal((prev) => ({ ...prev, isOpen: false }))
      setModal({
        isOpen: true,
        title: "Tutor registrado",
        message: "El tutor ha sido registrado exitosamente",
        type: "success",
      })
      refetchGuardians()
      setStep(2)
      setAnimationDirection("forward")
    } catch (error) {
      setLoadingModal((prev) => ({ ...prev, isOpen: false }))
      setModal({
        isOpen: true,
        title: "Error",
        message: error?.data?.message || "Ha ocurrido un error al registrar el tutor",
        type: "error",
      })
    }
  }

  // Función para generar boleta de pago
  const handleGeneratePayment = async (inscriptionId) => {
    try {
      setPaymentFlow((prev) => ({ ...prev, isGeneratingPayment: true }))
      setLoadingModal({
        isOpen: true,
        title: "Generando Boleta",
        message: "Generando boleta de pago...",
      })

      const paymentResponse = await generatePaymentByInscription(inscriptionId).unwrap()

      setPaymentFlow((prev) => ({
        ...prev,
        paymentOrder: paymentResponse.payment_order,
        competitor: paymentResponse.competitor,
        inscription: paymentResponse.inscription,
        isGeneratingPayment: false,
        showPaymentModal: true,
      }))

      setLoadingModal({ isOpen: false, title: "", message: "" })
    } catch (error) {
      console.error("Error al generar boleta:", error)
      setPaymentFlow((prev) => ({ ...prev, isGeneratingPayment: false }))
      setLoadingModal({ isOpen: false, title: "", message: "" })
      setModal({
        isOpen: true,
        title: "Error",
        message: error?.data?.message || "Error al generar la boleta de pago",
        type: "error",
      })
    }
  }

  // Función para validar pago
  const handleValidatePayment = async () => {
    if (!paymentFlow.paymentFile) {
      setModal({
        isOpen: true,
        title: "Error",
        message: "Debe seleccionar un archivo de comprobante de pago",
        type: "error",
      })
      return
    }

    try {
      setPaymentFlow((prev) => ({ ...prev, isValidatingPayment: true }))
      setLoadingModal({
        isOpen: true,
        title: "Validando Pago",
        message: "Validando comprobante de pago...",
      })

      const formData = new FormData()
      formData.append("image", paymentFlow.paymentFile)

     

      const validationResponse = await validatePaymentFromImage(formData).unwrap()

     // console.log("=== PAGO VALIDADO ===")
      console.log("Validation Response:", validationResponse)

      setPaymentFlow((prev) => ({
        ...prev,
        isValidatingPayment: false,
        paymentValidated: true,
        showUploadModal: false,
      }))

      setLoadingModal({ isOpen: false, title: "", message: "" })
      setModal({
        isOpen: true,
        title: "¡Pago Validado!",
        message: "El pago ha sido validado exitosamente. La inscripción está completa.",
        type: "success",
      })

      // Resetear todo después de validación exitosa
      setTimeout(() => {
        handleResetFlow()
      }, 3000)
    } catch (error) {
      console.error("Error al validar pago:", error)
      setPaymentFlow((prev) => ({ ...prev, isValidatingPayment: false }))
      setLoadingModal({ isOpen: false, title: "", message: "" })
      setModal({
        isOpen: true,
        title: "Error en Validación",
        message: error?.data?.message || "Error al validar el pago. Intente nuevamente.",
        type: "error",
      })
    }
  }

  // Función principal para registrar competidor (FLUJO UNIFICADO CORREGIDO)
  const handleCompetitorSubmit = async (data) => {
    try {
      // Validar que hay olimpiada seleccionada
      if (!selectedOlympic?.id) {
        setModal({
          isOpen: true,
          title: "Error",
          message: "Debe seleccionar una olimpiada antes de continuar",
          type: "error",
        })
        return
      }

      setLoadingModal({
        isOpen: true,
        title: "Registrando Competidor",
        message: "Creando competidor e inscripción...",
      })

  
      const competitorData = {
        name: data.name,
        last_name: data.last_name,
        ci: data.ci,
        birthday: data.birthday,
        phone: data.phone,
        email: data.email,
        school_id: data.school_id,
        curso: data.curso,
        guardian_ids: data.guardian_ids,
        olympic_id: selectedOlympic.id, 
        area_level_grade_ids: data.area_level_grade_ids,
      }

      

      const response = await postIncriptionCompetitor(competitorData).unwrap()

      console.log("=== COMPETIDOR E INSCRIPCIÓN CREADOS ===")
      console.log("Respuesta:", response)

      // Extraer inscription_id de la respuesta
      const inscriptionId = response.inscription?.id

      if (!inscriptionId) {
        throw new Error("No se recibió el ID de inscripción en la respuesta")
      }

      setPaymentFlow((prev) => ({
        ...prev,
        inscriptionId,
        competitorId: response.competitor?.id || response.id,
      }))

      setLoadingModal({ isOpen: false, title: "", message: "" })

      // Mostrar modal de éxito y preguntar si quiere generar boleta
      setModal({
        isOpen: true,
        title: "Competidor e Inscripción Creados",
        message:
          "El competidor y su inscripción han sido registrados exitosamente. ¿Desea generar la boleta de pago ahora?",
        type: "success",
        showSecondaryButton: true,
        primaryButtonText: "Generar Boleta",
        secondaryButtonText: "Más Tarde",
        onPrimaryClick: () => {
          setModal({ isOpen: false })
          handleGeneratePayment(inscriptionId)
        },
        onSecondaryClick: () => {
          setModal({ isOpen: false })
          handleResetFlow()
        },
      })
    } catch (error) {
      setLoadingModal({ isOpen: false, title: "", message: "" })
      console.error("Error en el proceso:", error)

      // Mostrar errores específicos si están disponibles
      let errorMessage = "Ha ocurrido un error en el proceso de registro"

      if (error?.data?.errors) {
        const errors = Object.values(error.data.errors).flat()
        errorMessage = errors.join(", ")
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      }

      setModal({
        isOpen: true,
        title: "Error",
        message: errorMessage,
        type: "error",
      })
    }
  }

  // Función para resetear el flujo
  const handleResetFlow = () => {
    setCompetitorData({})
    setGuardiansData([])
    setGuardianDataReverse({})
    setPaymentFlow({
      inscriptionId: null,
      competitorId: null,
      paymentOrder: null,
      competitor: null,
      inscription: null,
      isGeneratingPayment: false,
      isValidatingPayment: false,
      paymentValidated: false,
      showPaymentModal: false,
      showUploadModal: false,
      paymentFile: null,
    })
    setStep(1)
    setAnimationDirection("backward")
  }

  const handleBack = () => {
    setAnimationDirection("backward")
    setStep(1)
  }

  const closeModal = () => {
    setModal({ ...modal, isOpen: false })
  }

  // Función para manejar selección de archivo de pago
  const handlePaymentFileSelect = (file) => {
    setPaymentFlow((prev) => ({ ...prev, paymentFile: file }))
  }

  return (
    <AuthGuard>
      <InscriptionForm
        selectedOlympic={selectedOlympic}
        step={step}
        animationDirection={animationDirection}
        guardiansData={guardiansData}
        guardianDataReverse={guardianDataReverse}
        competitorData={competitorData}
        loadingModal={loadingModal}
        modal={modal}
        handleGuardianSubmit={handleGuardianSubmit}
        handleCompetitorSubmit={handleCompetitorSubmit}
        handleBack={handleBack}
        closeModal={closeModal}
        setStep={setStep}
        setAnimationDirection={setAnimationDirection}
        // Props para el flujo de pago
        paymentFlow={paymentFlow}
        onGeneratePayment={handleGeneratePayment}
        onValidatePayment={handleValidatePayment}
        onPaymentFileSelect={handlePaymentFileSelect}
        onResetFlow={handleResetFlow}
      />
    </AuthGuard>
  )
}

export default Incription
