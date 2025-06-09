import OlympicsList from "./olympicList"
import Title from "../common/title"
import GuardianRegister from "./guardientRegister"
import CompetitorRegister from "./competitorRegister"
import Modal from "./modal/modal"
import PaymentModal from "./paymentModal"
import BulkPaymentModal from "./bulkPaymentModal"
import CircularProgress from "@mui/material/CircularProgress"
import { usePostBulkInscriptionGuardianMutation } from "../app/redux/services/guardiansApi"
import { useBulkUploadCompetitorsMutation } from "../app/redux/services/competitorsApi"
import { useGeneratePaymentBySchoolMutation } from "../app/redux/services/paymentOrdersApi"
import BulkUploader from "../app/exel/bulkUPloader"
import { useState } from "react"

//  Plantilla para tutores
const templateHeadersGuardians = ["name", "last_name", "email", "ci", "phone", "type"]
const templateExampleGuardians = ["Juan", "Pérez", "juan@mail.com", "12345678", "71234567", "padre"]

// Plantilla para competidores (según tu CompetitorController)
const templateHeadersCompetitors = [
  "name",
  "last_name",
  "ci",
  "birthday",
  "phone",
  "email",
  "school_id",
  "curso",
  "guardians_ci",
  "olimpiada_id",
  "area_level_grades_ids",
]

const templateExampleCompetitors = [
  "María",
  "González López",
  "87654321",
  "2010-05-15",
  "71234567",
  "maria@mail.com",
  "1",
  "5to de primaria",
  "12345678,87654321",
  "1",
  "1,2,3",
]

const InscriptionForm = ({
  selectedOlympic,
  step,
  animationDirection,
  guardiansData,
  guardianDataReverse,
  competitorData,
  loadingModal,
  modal,
  handleGuardianSubmit,
  handleCompetitorSubmit,
  handleBack,
  closeModal,
  // Props para el flujo de pago
  paymentFlow,
  onGeneratePayment,
  onValidatePayment,
  onPaymentFileSelect,
  onResetFlow,
}) => {
  const [uploadGuardiansFile] = usePostBulkInscriptionGuardianMutation()
  const [bulkUploadCompetitors] = useBulkUploadCompetitorsMutation()
  const [generateSchoolPayment] = useGeneratePaymentBySchoolMutation()

  const [bulkUploadResult, setBulkUploadResult] = useState(null)
  const [showBulkResult, setShowBulkResult] = useState(false)
  const [bulkPaymentData, setBulkPaymentData] = useState(null)
  const [showBulkPaymentModal, setShowBulkPaymentModal] = useState(false)
  const [isProcessingBulk, setIsProcessingBulk] = useState(false)

  
  const handleBulkCompetitorsUpload = async (formData) => {
    setIsProcessingBulk(true)

    try {
      console.log("Iniciando carga masiva de competidores...")

      // 1. Subir archivo y procesar competidores
      const result = await bulkUploadCompetitors(formData).unwrap()
      console.log("Resultado carga masiva:", result)

      setBulkUploadResult(result)

      // 2. Si hay inscripciones creadas exitosamente, generar pago por escuela
      if (result.filas_creadas && result.filas_creadas.length > 0) {
        console.log("Generando pago por escuela...")

        // Obtener school_id del Excel o usar el seleccionado
        const schoolId = getSchoolIdFromFormData(formData) || selectedOlympic?.school_id || 1

        try {
          const paymentResult = await generateSchoolPayment(schoolId).unwrap()
          console.log("Pago por escuela generado:", paymentResult)

          // Configurar datos para el modal de pago
          setBulkPaymentData({
            paymentOrder: paymentResult.payment_order,
            inscriptions: paymentResult.inscriptions_summary,
            schoolId: schoolId,
            totalCompetitors: result.total_filas_creadas,
          })
          setShowBulkPaymentModal(true)
        } catch (paymentError) {
          console.error("Error generando pago por escuela:", paymentError)
          setShowBulkResult(true) // Mostrar solo resultado de carga
        }
      } else {
        setShowBulkResult(true) // Mostrar errores si no se crearon filas
      }

      return result
    } catch (error) {
      console.error(" Error en carga masiva:", error)
      setBulkUploadResult({
        total_filas_creadas: 0,
        total_errores: 1,
        errores: [error.message || "Error desconocido en la carga masiva"],
      })
      setShowBulkResult(true)
      throw error
    } finally {
      setIsProcessingBulk(false)
    }
  }

  // Función auxiliar para obtener school_id del FormData
  const getSchoolIdFromFormData = (formData) => {
    // Si necesitas extraer el school_id del archivo Excel, implementar aquí
    // Por ahora retorna null para usar el selectedOlympic
    return null
  }

  return (
    <>
      <OlympicsList />
      <div className="min-h-screen max-w-[1400px] mx-auto lg:px-16">
        <Title
          title={`Inscripción a las Olimpiadas ${selectedOlympic?.name ? `- ${selectedOlympic.name}` : ""}`}
          className="text-2xl md:text-3xl font-bold text-center text-white mb-8"
        />

        <div className="mb-8">
          <BulkUploader
            title="Carga Masiva de Competidores"
            onUpload={handleBulkCompetitorsUpload}
            templateHeaders={templateHeadersCompetitors}
            templateExample={templateExampleCompetitors}
            templateFileName="plantilla_competidores.xlsx"
            uploadLabel="Subir Competidores"
            downloadLabel="Descargar Plantilla Competidores"
            disabled={isProcessingBulk}
            
          />

          {/* Información sobre el Excel */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📋 Información del Excel:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p>
                  <strong>school_id:</strong> ID del colegio (número)
                </p>
                <p>
                  <strong>olimpiada_id:</strong> ID de la olimpiada (número)
                </p>
                <p>
                  <strong>guardians_ci:</strong> CIs de tutores separados por comas
                </p>
                <p>
                  <strong>area_level_grades_ids:</strong> IDs de áreas separados por comas
                </p>
              </div>
              <div>
                <p>
                  <strong>birthday:</strong> Formato YYYY-MM-DD
                </p>
                <p>
                  <strong>curso:</strong> Ej: "5to de primaria"
                </p>
                <p>
                  <strong>ci:</strong> Cédula única del competidor
                </p>
                <p>
                  <strong>email:</strong> Email único del competidor
                </p>
              </div>
            </div>
          </div>
        </div>

        <BulkUploader
          title="Carga masiva para tutores"
          onUpload={uploadGuardiansFile}
          templateHeaders={templateHeadersGuardians}
          templateExample={templateExampleGuardians}
          templateFileName="plantilla_tutores.xlsx"
          uploadLabel="Subir Tutores"
          downloadLabel="Descargar Plantilla Tutores"
        />

        <div className="relative overflow-hidden mt-2">
          <div
            className={`transition-all duration-700 ease-in-out ${
              step === 1
                ? "translate-x-0 opacity-100"
                : animationDirection === "backward"
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
            } ${step !== 1 && "absolute top-0 left-0 w-full"}`}
          >
            <GuardianRegister onSubmit={handleGuardianSubmit} initialData={guardianDataReverse} />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${
              step === 2
                ? "translate-x-0 opacity-100"
                : animationDirection === "forward"
                  ? "translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
            } ${step !== 2 && "absolute top-0 left-0 w-full"}`}
          >
            <CompetitorRegister
              onSubmit={handleCompetitorSubmit}
              onBack={handleBack}
              initialData={competitorData}
              guardians={guardiansData}
            />
          </div>
        </div>

        {/* Modal de carga en progreso */}
        <Modal
          isOpen={isProcessingBulk || loadingModal.isOpen}
          title={isProcessingBulk ? "Procesando Carga Masiva" : loadingModal.title}
          showCloseButton={false}
          showButtons={false}
        >
          <div className="flex flex-col items-center justify-center py-4">
            <CircularProgress color="error" className="mb-4" />
            <p>{isProcessingBulk ? "Procesando competidores y generando boleta de pago..." : loadingModal.message}</p>
          </div>
        </Modal>

  
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          iconType={modal.type}
          primaryButtonText={modal.primaryButtonText || "Ok"}
          secondaryButtonText={modal.secondaryButtonText}
          onPrimaryClick={modal.onPrimaryClick || closeModal}
          onSecondaryClick={modal.onSecondaryClick}
          showSecondaryButton={modal.showSecondaryButton}
        >
          <p>{modal.message}</p>
        </Modal>

        <Modal
          isOpen={showBulkResult}
          onClose={() => setShowBulkResult(false)}
          title="Resultado de Carga Masiva"
          iconType={bulkUploadResult?.total_errores > 0 ? "warning" : "success"}
          primaryButtonText="Entendido"
          onPrimaryClick={() => setShowBulkResult(false)}
        >
          {bulkUploadResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-green-800 font-semibold">Competidores Inscritos:</p>
                  <p className="text-2xl font-bold text-green-600">{bulkUploadResult.total_filas_creadas}</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-red-800 font-semibold">Errores:</p>
                  <p className="text-2xl font-bold text-red-600">{bulkUploadResult.total_errores}</p>
                </div>
              </div>

              {bulkUploadResult.errores && bulkUploadResult.errores.length > 0 && (
                <div className="bg-red-50 p-3 rounded max-h-40 overflow-y-auto">
                  <p className="text-red-800 font-semibold mb-2">Errores encontrados:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {bulkUploadResult.errores.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Modal>

        <BulkPaymentModal
          isOpen={showBulkPaymentModal}
          paymentData={bulkPaymentData}
          onClose={() => setShowBulkPaymentModal(false)}
          onValidatePayment={onValidatePayment}
          onFileSelect={onPaymentFileSelect}
        />

       
        <PaymentModal
          isOpen={paymentFlow?.showPaymentModal}
          paymentOrder={paymentFlow?.paymentOrder}
          competitor={paymentFlow?.competitor}
          inscription={paymentFlow?.inscription}
          onClose={() => onResetFlow()}
          onValidatePayment={onValidatePayment}
          onFileSelect={onPaymentFileSelect}
          selectedFile={paymentFlow?.paymentFile}
          isValidating={paymentFlow?.isValidatingPayment}
        />
      </div>
    </>
  )
}

export default InscriptionForm
