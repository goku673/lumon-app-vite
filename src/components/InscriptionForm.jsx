"use client"

import OlympicsList from "./olympicList"
import Title from "../common/title"
import BatchProcessingUI from "../app/services/exel/BatchProcessingUI"
import GuardianRegister from "./guardientRegister"
import CompetitorRegister from "./competitorRegister"
import Modal from "./modal/modal"
import PaymentModal from "./paymentModal"
import CircularProgress from "@mui/material/CircularProgress"
import { usePostBulkInscriptionGuardianMutation } from "../app/redux/services/guardiansApi"
import BulkUploader from "../app/exel/bulkUPloader"

const templateHeadersGuardians = ["name", "last_name", "email", "ci", "phone", "type"]
const templateExampleGuardians = ["Juan", "Pérez", "juan@mail.com", "12345678", "71234567", "padre"]

const InscriptionForm = ({
  selectedOlympic,
  step,
  animationDirection,
  guardiansData,
  guardianDataReverse,
  competitorData,
  loadingModal,
  modal,
  templateHeaders,
  templateExample,
  excelProcessor,
  handleProcessRecords,
  handleExportResults,
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
  const [upluadFile] = usePostBulkInscriptionGuardianMutation()

  return (
    <>
      <OlympicsList />
      <div className="min-h-screen max-w-[1400px] mx-auto lg:px-16">
        <Title
          title={`Inscripción a las Olimpiadas ${selectedOlympic?.name ? `- ${selectedOlympic.name}` : ""}`}
          className="text-2xl md:text-3xl font-bold text-center text-white mb-8"
        />

        <BatchProcessingUI
          title="Carga Masiva de Competidores"
          onProcessRecords={handleProcessRecords}
          onExportResults={handleExportResults}
          templateHeaders={templateHeaders}
          templateExample={templateExample}
          processor={excelProcessor}
          className="mb-8"
        />

        <BulkUploader
          title="Carga masiva para tutores"
          onUpload={upluadFile}
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

        {/* Modal de carga */}
        <Modal isOpen={loadingModal.isOpen} title={loadingModal.title} showCloseButton={false} showButtons={false}>
          <div className="flex flex-col items-center justify-center py-4">
            <CircularProgress color="error" className="mb-4" />
            <p>{loadingModal.message}</p>
          </div>
        </Modal>

        {/* Modal principal */}
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

        {/* Modal de pago mejorado */}
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
