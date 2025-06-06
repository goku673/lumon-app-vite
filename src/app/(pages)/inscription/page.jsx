
import { useState } from "react";
import { usePostInscriptionCompetitorMutation } from "../../redux/services/competitorsApi";
import { usePostIncriptionGuardianMutation, useGetGuardiansQuery } from "../../redux/services/guardiansApi";
import { useSelector } from "react-redux";
import useExcelProcessor from "../../services/exel/ExcelProcessor";
import InscriptionForm from "../../../components/InscriptionForm";
import AuthGuard from "../../../components/AuthGuard";

const Incription = () => {
  const selectedOlympic = useSelector((state) => state.olympic.selectedOlympic);
  const [step, setStep] = useState(1);
  const { refetch: refetchGuardians } = useGetGuardiansQuery();
  const [competitorData, setCompetitorData] = useState({});
  const [guardiansData, setGuardiansData] = useState([]);
  const [guardianDataReverse, setGuardianDataReverse] = useState({});
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const [loadingModal, setLoadingModal] = useState({ isOpen: false, title: "Procesando", message: "Registrando competidor..." });
  const [animationDirection, setAnimationDirection] = useState("forward");
  const [postIncriptionGuardian] = usePostIncriptionGuardianMutation();
  const [postIncriptionCompetitor] = usePostInscriptionCompetitorMutation();
  const templateHeaders = ["nombre", "apellido", "ci", "fecha_nacimiento", "telefono", "email", "colegio_id", "curso", "tutor_ids", "olimpiada_id", "area_level_grade_ids"];
  const templateExample = ["Juan", "Pérez López", "12345678", "2005-10-12", "77123456", "juan@example.com", "361", "1ro de primaria", "1", selectedOlympic?.id || "4", "84"];

  const excelProcessor = useExcelProcessor({
    processRecord: async (record) => {
      const competitorPayload = {
        name: record.nombre,
        last_name: record.apellido,
        ci: record.ci,
        birthday: record.fecha_nacimiento,
        phone: record.telefono,
        email: record.email,
        school_id: parseInt(record.colegio_id) || "",
        curso: record.curso,
        guardian_ids: record.tutor_ids.toString().split(',').map(id => parseInt(id.trim())),
        olympic_id: parseInt(record.olimpiada_id) || selectedOlympic?.id,
        area_level_grade_ids: record.area_level_grade_ids.toString().split(',').map(id => parseInt(id.trim()))
      };
      const response = await postIncriptionCompetitor(competitorPayload).unwrap();
      return response;
    }
  });

  const handleProcessRecords = (records, callbacks) => {
    excelProcessor.processRecords(records);

    if (callbacks && callbacks.onProgress) {
      const progressInterval = setInterval(() => {
        if (excelProcessor.isProcessing) {
          callbacks.onProgress({
            current: excelProcessor.processedRecords,
            total: excelProcessor.totalRecords,
            percentage: excelProcessor.progress
          });
        } else {
          clearInterval(progressInterval);

          if (callbacks.onComplete) {
            callbacks.onComplete({
              total: excelProcessor.totalRecords,
              success: excelProcessor.successList.length,
              failed: excelProcessor.failedList.length,
              successList: excelProcessor.successList,
              failedList: excelProcessor.failedList
            });
          }
        }
      }, 500);
    }
  };

  const handleExportResults = () => {
    excelProcessor.exportResults("inscripciones_competidores");
  };

  const handleGuardianSubmit = async (data) => {
    try {
      if (data.selectedGuardians.length > 0 &&
        !(data.apellidoPaterno && data.apellidoMaterno && data.nombres && data.email && data.celular && data.comprobantePago && data.tipo)) {
        setGuardiansData(data.selectedGuardians);
        setStep(2);
        setAnimationDirection("forward");
        return;
      }

      setLoadingModal(prev => ({ ...prev, isOpen: true }));
      const response = await postIncriptionGuardian(data).unwrap();
      setGuardiansData(prev => [...prev, response]);
      setLoadingModal(prev => ({ ...prev, isOpen: false }));
      setModal({
        isOpen: true,
        title: "Tutor registrado",
        message: "El tutor ha sido registrado exitosamente",
        type: "success"
      });
      refetchGuardians();
      setStep(2);
      setAnimationDirection("forward");
    } catch (error) {
      setLoadingModal(prev => ({ ...prev, isOpen: false }));
      setModal({
        isOpen: true,
        title: "Error",
        message: error?.data?.message || "Ha ocurrido un error al registrar el tutor",
        type: "error"
      });
    }
  };

  const handleCompetitorSubmit = async (data) => {
    try {
      setLoadingModal(prev => ({ ...prev, isOpen: true }));
      await postIncriptionCompetitor(data).unwrap();
      setLoadingModal(prev => ({ ...prev, isOpen: false }));
      setModal({
        isOpen: true,
        title: "Competidor registrado",
        message: "El competidor ha sido registrado exitosamente",
        type: "success"
      });
      setCompetitorData({});
      setGuardiansData([]);
      setGuardianDataReverse({});
      setStep(1);
      setAnimationDirection("backward");
    } catch (error) {
      setLoadingModal(prev => ({ ...prev, isOpen: false }));
      setModal({
        isOpen: true,
        title: "Error",
        message: error?.data?.message || "Ha ocurrido un error al registrar el competidor",
        type: "error"
      });
    }
  };

  const handleBack = () => {
    setAnimationDirection("backward");
    setStep(1);
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

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
      templateHeaders={templateHeaders}
      templateExample={templateExample}
      excelProcessor={excelProcessor}
      handleProcessRecords={handleProcessRecords}
      handleExportResults={handleExportResults}
      handleGuardianSubmit={handleGuardianSubmit}
      handleCompetitorSubmit={handleCompetitorSubmit}
      handleBack={handleBack}
      closeModal={closeModal}
      setStep={setStep}
      setAnimationDirection={setAnimationDirection}
    />
  </AuthGuard>
  );
};

export default Incription;