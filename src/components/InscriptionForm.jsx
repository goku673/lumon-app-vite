import OlympicsList from "./olympicList";
import Title from "../common/title";
import BatchProcessingUI from "../app/services/exel/BatchProcessingUI";
import GuardianRegister from "./guardientRegister";
import CompetitorRegister from "./competitorRegister";
import Modal from "./modal/modal";
import CircularProgress from '@mui/material/CircularProgress';

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
}) => {
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

        <div className="relative overflow-hidden">
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

        <Modal
          isOpen={loadingModal.isOpen}
          title={loadingModal.title}
          showCloseButton={false}
          showButtons={false}
        >
          <div className="flex flex-col items-center justify-center py-4">
            <CircularProgress color="error" className="mb-4" />
            <p>{loadingModal.message}</p>
          </div>
        </Modal>

        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          iconType={modal.type}
          primaryButtonText="Ok"
          onPrimaryClick={closeModal}
        >
          <p>{modal.message}</p>
        </Modal>
      </div>
    </>
  );
}

export default InscriptionForm;